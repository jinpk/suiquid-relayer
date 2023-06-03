import { ApiProperty } from '@nestjs/swagger';

export class PostPlayerDto {
  @ApiProperty({ description: 'Display name of player' })
  readonly name: string;

  @ApiProperty({ description: 'wallet address' })
  readonly address: string;
}
