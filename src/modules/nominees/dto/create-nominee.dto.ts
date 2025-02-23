import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNomineeDto {
  @ApiProperty({ example: 'Dune: Part Two', description: 'A mű címe' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      'A 2021-es Dűne folytatása Frank Herbert 1965-ös Dune című regényének adaptációjának második része.',
    description: 'A mű címe',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2024', description: 'Megjelenés éve' })
  @IsNotEmpty()
  release: number;

  @ApiProperty({ example: 'Denis Villeneuve', description: 'Rendező neve' })
  @IsNotEmpty()
  director: string;

  @ApiProperty({ example: 'true', description: 'Győztes-e' })
  @IsOptional()
  winner: boolean;
}
