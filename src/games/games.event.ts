import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GameCreatedEvent } from './event/game-created.event';
import { GamesGateway } from './games.gateway';
import { GamePlayerJoinedEvent } from './event/game-player-joined.event';
import { GamesService } from './games.service';
import { GameStateEnum } from './enum/game-state.enum';

@Injectable()
export class GamesEvent {
  constructor(
    readonly gamesGateway: GamesGateway,
    readonly gamesService: GamesService,
  ) {}

  @OnEvent(GameCreatedEvent.name)
  handleGameCreatedEvent(payload: GameCreatedEvent) {
    // socket broadcast emit to all clients
    this.gamesGateway.broadcastNewGameCreated(payload.game);
  }

  @OnEvent(GamePlayerJoinedEvent.name)
  handleGamePlayerJoinedEvent(payload: GamePlayerJoinedEvent) {
    // socket broadcast emit to all clients
    this.gamesGateway.broadcastGamePlayerJoined(
      payload.gameId,
      payload.playerId,
    );

    // starts game when player length is reached to mnemonic length
    const game = this.gamesService.findOne(payload.gameId);
    if (game.mnemonics.length === game.players.length) {
      // ready first
      game.state = GameStateEnum.READY;
      this.gamesService.set(game);

      const afterStartMs = 5000;
      this.gamesGateway.broadcastGameReady(payload.gameId, afterStartMs);

      let tm = setTimeout(() => {
        clearTimeout(tm);

        game.state = GameStateEnum.PLAYING;
        this.gamesService.set(game);

        // start the game
        this.gamesGateway.broadcastGameStarted(payload.gameId);

        // call user coordnatie init
        this.gamesService.initPlayersCoordinates(game.id);
      }, afterStartMs);
    }
  }
}
