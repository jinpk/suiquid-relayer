import { ApiProperty } from '@nestjs/swagger';

export class CreateGameDto {
  @ApiProperty({
    description: 'uniqueId from smart contract',
  })
  id: string;

  @ApiProperty({
    description: 'Disply your brand name.',
  })
  name: string;
}
