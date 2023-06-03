import { Injectable } from '@nestjs/common';
import { Game } from './interface/game.interface';

@Injectable()
export class GamesUtils {
  getUnusedMnemonic(game: Game): string {
    let menmonic =
      game.mnemonics[Math.floor(Math.random() * game.mnemonics.length)];

    let found = false;
    while (!found) {
      if (game.usedMnemonics.findIndex((x) => x === menmonic) === -1) {
        found = true;
      }
      menmonic =
        game.mnemonics[Math.floor(Math.random() * game.mnemonics.length)];
    }

    return menmonic;
  }
}
