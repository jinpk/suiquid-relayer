import { ApiProperty } from '@nestjs/swagger';

export class CreateGameDto {
  @ApiProperty({
    description: 'uniqueId or smartcontract address.',
  })
  id: string;

  @ApiProperty({
    description: 'Disply name of your game.',
  })
  name: string;

  @ApiProperty({
    description: 'Give us your !account! that you wanna bet on.',
  })
  mnemonics: string[];

  @ApiProperty({
    description: 'How much sui in your wallet.',
  })
  deposit: number;
}

/**
  @ApiProperty({ description: 'The address that beat you' })
  readonly losedBy: string | undefined;

  @ApiProperty({ description: 'Played game' })
  readonly gameId: string | undefined; */
