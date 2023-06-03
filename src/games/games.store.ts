import { Socket } from 'socket.io';
import { Game } from './interface/game.interface';
import { GamePlay } from './interface/game-play.interface';

export const gameStore = new Map<
  string, // id
  Game // game
>();

export const gameClientStore = new Map<
  string, // walletAddress
  Socket
>();

export const gamePlayStore = new Map<
  string, // {gameId}/{playerId}
  GamePlay //
>();
