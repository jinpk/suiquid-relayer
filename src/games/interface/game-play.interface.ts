import { Direction } from '../enum/direction.enum';

export interface PlayerMove {
  x: number;
  y: number;
  direction: Direction;
}

export interface PlayerGame {
  gameId: string;
  move: PlayerMove;

  mnemonics: string[]; // user's menmonics

  losedBy: string | null; // player.address
}
