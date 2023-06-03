import { Injectable } from '@nestjs/common';
import { Game } from './interface/game.interface';
import { GamesUtils } from './games.utils';
import { gameStore } from './games.store';
import { GamesGateway } from './games.gateway';
import { GAME_CANVAS_HEIGHT, GAME_CANVAS_WIDTH } from 'src/constants';

@Injectable()
export class GamesService {
  constructor(
    private readonly gamesUtils: GamesUtils,
    private readonly gamesGateway: GamesGateway,
  ) {}

  initPlayersCoordinates(gameId: string) {
    const game = this.findOne(gameId);

    game.players.forEach((playerId) => {
      this.gamesGateway.broadcastInitPlayerCoordinate(
        game.id,
        playerId,
        Math.floor(Math.random() * (GAME_CANVAS_WIDTH - 1 + 1) + 1), // x
        Math.floor(Math.random() * (GAME_CANVAS_HEIGHT - 1 + 1) + 1), // y
      );
    });
  }

  listGames() {
    const games: Game[] = [];

    for (const game of gameStore.values()) {
      games.push(game);
    }

    return games;
  }

  findOne(gameId: string): Game {
    const game = gameStore.get(gameId);
    return game;
  }

  set(game: Game) {
    gameStore.set(game.id, game);
  }

  join(gameId: string, playerId: string): string {
    const game = gameStore.get(gameId);
    if (game.mnemonics.length >= game.players.length) {
      throw `There are no seats for game: ${gameId}`;
    }
    if (game.winningPlayer) {
      throw `already finisehd the game: ${gameId}`;
    }

    game.players.push(playerId);

    const menmonic = this.gamesUtils.getUnusedMnemonic(game);
    game.usedMnemonics.push(menmonic);

    gameStore.set(gameId, game);

    return menmonic;
  }

  hasGameById(id: string): boolean {
    return gameStore.has(id);
  }

  addGame(game: Game) {
    gameStore.set(game.id, game);
  }
}
