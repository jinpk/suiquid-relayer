import { Direction } from '../enum/direction.enum';

export interface GamePlay {
  x: number;
  y: number;
  direction: Direction;

  mnemonics: string[];

  losedBy: string | null; // player.address
}
