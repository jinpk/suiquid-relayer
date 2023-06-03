import { GameStateEnum } from '../enum/game-state.enum';

export interface Game {
  id: string; // game id or smart contract address

  name: string; // name of game

  mnemonics: string[]; // 12 word list
  usedMnemonics: string[]; // used word list
  players: string[]; // 12 players

  winningPlayer: string | null; // winner, if is not null that means finished game

  state: GameStateEnum;

  deposit: number; // deposit of game
}
