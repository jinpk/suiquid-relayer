import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetPlayerDto } from './dto/get-player.dto';
import { PostPlayerDto } from './dto/post-player.dto';

@Controller('players')
@ApiTags('Player')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @ApiOperation({
    summary: 'Find player by address',
  })
  @Get(':address/by_address')
  @ApiOkResponse({ type: GetPlayerDto })
  public getPlayer(@Param('address') address: string): GetPlayerDto {
    if (!this.playersService.hasPlayer(address)) {
      throw new NotFoundException(`not found user by address: ${address}`);
    }

    const player = this.playersService.find(address);

    return {
      address: player.address,
      name: player.name,
    };
  }

  @ApiOperation({
    summary: 'List players',
  })
  @Get('')
  @ApiOkResponse({ type: [GetPlayerDto] })
  public getPlayers(): GetPlayerDto[] {
    const players = this.playersService.findAll();

    return players.map(
      (player) =>
        ({
          address: player.address,
          name: player.name,
        } as GetPlayerDto),
    );
  }

  @ApiOperation({
    summary: 'Regenerate Api Key',
    description:
      '**response** > `apiKey`: string.' +
      '<br/>You can temporarily save the apiKey to localStorage.',
  })
  @Post(':address/key/by_address')
  @ApiCreatedResponse({
    type: String,
    description: 'Regenerated Api Key',
  })
  public postApiKey(@Param('address') address: string): string {
    // TODO: verifiy address

    if (!this.playersService.hasPlayer(address)) {
      throw new NotFoundException('not found player.');
    }

    const apiKey = this.playersService.regenerateApiKey(address);
    return apiKey;
  }

  @ApiOperation({
    summary: 'Register as player',
    description:
      '**response** > `apiKey`: string.' +
      '<br/>You can temporarily save the apiKey to localStorage.',
  })
  @Post('')
  @ApiCreatedResponse({
    type: String,
    description: 'Your Api Key',
  })
  public postPlayer(@Body() body: PostPlayerDto): string {
    // TODO: verifiy address

    if (this.playersService.hasPlayer(body.address)) {
      throw new ConflictException('already registered');
    }

    const apiKey = this.playersService.register(body.address, body.name);

    return apiKey;
  }
}
