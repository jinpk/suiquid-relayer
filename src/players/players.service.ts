import { Injectable } from '@nestjs/common';
import { Player } from './interface/player.interface';
import { randomBytes } from 'crypto';
import { playerApiKeyIndexStore, playerStore } from './players.store';

const API_KEY_SIZE = 64;

@Injectable()
export class PlayersService {
  constructor() {}

  authenticate(apiKey: string): string {
    if (!playerApiKeyIndexStore.has(apiKey)) {
      throw 'invalid api key.';
    }

    return playerApiKeyIndexStore.get(apiKey);
  }

  hasPlayer(walletAddress: string) {
    return playerStore.has(walletAddress);
  }

  findAll(): Player[] {
    const players = [];
    for (const player of playerStore.values()) {
      players.push(player);
    }
    return players;
  }

  find(walletAddress: string) {
    return playerStore.get(walletAddress);
  }

  register(walletAddress: string, name: string): string {
    const player: Player = {
      address: walletAddress,
      name: name,
      apiKey: randomBytes(API_KEY_SIZE)
        .toString('base64')
        .slice(0, API_KEY_SIZE),
    };

    playerStore.set(walletAddress, player);

    playerApiKeyIndexStore.set(player.apiKey, walletAddress);

    return player.apiKey;
  }

  regenerateApiKey(walletAddress: string): string {
    const player = playerStore.get(walletAddress);

    // delete index
    playerApiKeyIndexStore.delete(player.apiKey);

    player.apiKey = randomBytes(API_KEY_SIZE)
      .toString('base64')
      .slice(0, API_KEY_SIZE);

    // save new api key
    playerStore.set(player.address, player);

    // create index
    playerApiKeyIndexStore.set(player.apiKey, player.address);

    return player.apiKey;
  }
}
