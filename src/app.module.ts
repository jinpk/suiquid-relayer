import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { GamesModule } from './games/games.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot(), PlayersModule, GamesModule],
})
export class AppModule {}
