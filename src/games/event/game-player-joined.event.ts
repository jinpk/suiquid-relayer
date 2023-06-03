export class GamePlayerJoinedEvent {
  constructor(readonly gameId: string, readonly playerId: string) {}
}
