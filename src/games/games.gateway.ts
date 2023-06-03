import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { gameClientStore, gamePlayStore } from './games.store';
import { PlayersService } from 'src/players/players.service';
import { Direction } from './enum/direction.enum';
import { GamesUtils } from './games.utils';

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: ['*'],
  },
})
export class GamesGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  ns: Namespace;

  constructor(
    private readonly playersSerivce: PlayersService,
    private readonly gamesUtils: GamesUtils,
  ) {}

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

  broadcastGamePlayerJoined(gameId: string, playerId: string) {
    this.ns.emit('joined', gameId, playerId);
  }

  broadcastGameReady(gameId: string, afterStartMs: number) {
    this.ns.emit('ready', gameId, afterStartMs);
  }

  broadcastGameStarted(gameId: string) {
    this.ns.emit('started', gameId);
  }

  broadcastMoved(
    gameId: string,
    playerId: string,
    x: number,
    y: number,
    direction: Direction,
  ) {
    this.ns.emit('moved', gameId, playerId, x, y, direction);
  }

  // TODO: catch | win | lose all business logics are here.
  /*broadcastCatched(gameId: string, fromPlayerId: string, toPlayerId: string) {
    this.ns.emit('catched', gameId, fromPlayerId, toPlayerId);
  }

  broadcastCatchedMnemonic(
    gameId: string,
    toPlayerId: string,
    mnemonic: string[],
  ) {
    const client = gameClientStore.get(toPlayerId);
    if (!client) {
      return console.log(
        `player ${toPlayerId} is dosen't exist in game: ${gameId}`,
      );
    }
    client.emit('mnemonic', gameId, mnemonic);
  }*/

  // TODO: if only one user survied.
  /*broadcastGameFinished(game: Game, winingPlayerId: string) {
    this.ns.emit('finished', game.id, winingPlayerId);
  }*/

  broadcastInitPlayer(
    gameId: string,
    playerId: string,
    x: number,
    y: number,
    mnemonic: string,
  ) {
    const client = gameClientStore.get(playerId);
    if (client) {
      client.emit('inited', gameId, x, y, mnemonic);
    } else {
      console.log(`player ${playerId} is not connected with socket`);
    }
  }

  /** Server subscrbie listeners */
  afterInit(server: Namespace) {
    server.on(
      'move',
      (
        gameId: string,
        playerId: string,
        x: number,
        y: number,
        direction: Direction,
        catched: boolean,
      ) => {
        console.log('move detected');

        const client = gameClientStore.get(playerId);
        const apiKey = client.handshake.auth.token;

        // auth
        let address: string;
        try {
          address = this.playersSerivce.authenticate(apiKey);
        } catch (error) {
          return console.error(error);
        }

        const gamePlay = gamePlayStore.get(
          this.gamesUtils.getGamePlayKeyPefix(gameId, playerId),
        );
        if (!gamePlay) return;

        gamePlay.direction = direction;
        gamePlay.x = x;
        gamePlay.y = y;
        gamePlayStore.set(
          this.gamesUtils.getGamePlayKeyPefix(gameId, playerId),
          gamePlay,
        );

        // emit all users some player is moved.
        this.broadcastMoved(
          gameId,
          playerId,
          gamePlay.x,
          gamePlay.y,
          gamePlay.direction,
        );

        // TODO: 판정처리
        // TODO: lose | win 처리
        // TODO: 게임종료
        // TODO: 상금부여
      },
    );
  }
}
