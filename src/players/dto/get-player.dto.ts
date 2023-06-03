import { ApiProperty } from '@nestjs/swagger';

export class GetPlayerDto {
  @ApiProperty({ description: 'Sui Wallet address of player' })
  readonly address: string;

  @ApiProperty({ description: 'Display name of player' })
  readonly name: string;
}
