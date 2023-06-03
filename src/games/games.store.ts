import { Socket } from 'socket.io';
import { Game } from './interface/game.interface';

export const gameStore = new Map<
  string, // id
  Game // game
>();

export const gameClientStore = new Map<
  string, // walletAddress
  Socket
>();
