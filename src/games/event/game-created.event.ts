import { Game } from "../interface/game.interface";

export class GameCreatedEvent {
  constructor(readonly game: Game) {}
}
