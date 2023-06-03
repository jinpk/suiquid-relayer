import { ApiProperty } from '@nestjs/swagger';

export class GameDto {
  @ApiProperty({
    description: 'game unique id',
  })
  id: string;

  @ApiProperty({
    description: 'Diplay name',
  })
  name: string;

  @ApiProperty({
    description: 'sui deposit amount',
  })
  deposit: number;
}
