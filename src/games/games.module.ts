import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesUtils } from './games.utils';
import { GamesController } from './games.controller';
import { PlayersModule } from 'src/players/players.module';
import { GamesGateway } from './games.gateway';
import { GamesEvent } from './games.event';

@Module({
  imports: [PlayersModule],
  providers: [GamesUtils, GamesService, GamesGateway, GamesEvent],
  controllers: [GamesController],
  exports: [GamesGateway],
})
export class GamesModule {}
