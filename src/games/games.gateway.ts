import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Game } from './interface/game.interface';
import { Namespace, Socket } from 'socket.io';
import { Player } from 'src/players/interface/player.interface';
import { gameClientStore } from './games.store';

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: ['*'],
  },
})
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  ns: Namespace;

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const address = client.handshake.query.address as string;
    console.log(`disconnected game nsp: ${address} `);

    gameClientStore.delete(address);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    const apiKey = client.handshake.auth.token as string;
    const address = client.handshake.query.address as string;
    console.log(`connected game nsp: ${address} `);

    gameClientStore.set(address, client);
  }

  broadcastNewGameCreated(game: Game) {
    this.ns.emit('created', game.id);
  }

  broadcastGamePlayerJoined(gameId: string, playerId: string) {
    this.ns.emit('joined', gameId, playerId);
  }

  broadcastGameReady(gameId: string, afterStartMs: number) {
    this.ns.emit('ready', gameId, afterStartMs);
  }

  broadcastGameStarted(gameId: string) {
    this.ns.emit('started', gameId);
  }

  broadcastGameFinished(game: Game, winingPlayer: Player) {
    this.ns.emit('finished', game.id, winingPlayer.address);
  }

  broadcastInitPlayerCoordinate(
    gameId: string,
    playerId: string,
    x: number,
    y: number,
  ) {
    const client = gameClientStore.get(playerId);
    if (client) {
      client.emit('inited', gameId, x, y, 'haha');
    } else {
      console.log(`player ${playerId} is not connected with socket`);
    }
  }
}
