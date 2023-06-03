import { Player } from './interface/player.interface';

export const playerStore = new Map<
  string, // wallet address
  Player
>();

export const playerApiKeyIndexStore = new Map<
  string, // apikey
  string // wallet address
>();
