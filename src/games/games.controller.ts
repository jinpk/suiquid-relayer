import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GamesService } from './games.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PlayersService } from 'src/players/players.service';
import { CreateGameDto } from './dto/create-game.dto';
import { GameDto } from './dto/game.dto';
import { Game } from './interface/game.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameCreatedEvent } from './event/game-created.event';
import { GamePlayerJoinedEvent } from './event/game-player-joined.event';
import { GameStateEnum } from './enum/game-state.enum';

@Controller('games')
@ApiTags('Game')
export class GamesController {
  constructor(
    private gamesService: GamesService,
    private playersService: PlayersService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post('')
  @ApiOperation({
    summary: 'Create a Game',
    description:
      'Anyone can make your own game:)' +
      '<br/>anyone can join your game when you opened a game.' +
      '<br/>game starts when player reaches the number of mnemonic words:)',
  })
  @ApiCreatedResponse({
    description: 'Congrat!',
  })
  postGame(@Body() body: CreateGameDto) {
    if (!body.mnemonics || !body.mnemonics.length) {
      throw new BadRequestException(`you should give us your account!!!`);
    }

    // TODO: should we validate account or smart contract?
    if (this.gamesService.hasGameById(body.id)) {
      throw new ConflictException(`already added game: ${body.id}`);
    }

    const game: Game = {
      id: body.id,
      name: body.name,
      mnemonics: body.mnemonics,
      usedMnemonics: [],
      players: [],
      deposit: body.deposit,
      winningPlayer: null,
      state: GameStateEnum.PENDING,
    };

    this.gamesService.addGame(game);

    this.eventEmitter.emit(GameCreatedEvent.name, new GameCreatedEvent(game));
  }

  @Get(':gameId')
  @ApiOperation({
    summary: 'Find a game',
  })
  @ApiOkResponse({
    type: GameDto,
  })
  getGame(@Param('gameId') gameId: string): GameDto {
    if (!this.gamesService.hasGameById(gameId)) {
      throw new NotFoundException('not found game.');
    }

    const game = this.gamesService.findOne(gameId);

    return {
      name: game.name,
      deposit: game.deposit,
      id: game.id,
    };
  }

  @Get('')
  @ApiOperation({
    summary: 'List games',
  })
  @ApiOkResponse({
    type: [GameDto],
  })
  listGame(): GameDto[] {
    return this.gamesService.listGames().map((x) => ({
      name: x.name,
      id: x.id,
      deposit: x.deposit,
    }));
  }

  @Post(':gameId/join')
  @ApiOperation({
    summary: 'Join the game',
  })
  @ApiQuery({
    name: 'key',
    description: 'Player apiKey',
  })
  joinGame(@Param('gameId') gameId: string, @Query('key') apiKey: string) {
    if (!this.gamesService.hasGameById(gameId)) {
      throw new NotFoundException('not found game');
    }

    let playerId: string;
    try {
      playerId = this.playersService.authenticate(apiKey);
    } catch (error: any) {
      throw new ForbiddenException(error);
    }

    try {
      this.gamesService.join(gameId, playerId);
    } catch (error: any) {
      throw new UnprocessableEntityException(error);
    }

    this.eventEmitter.emit(
      GamePlayerJoinedEvent.name,
      new GamePlayerJoinedEvent(gameId, playerId),
    );
  }
}
