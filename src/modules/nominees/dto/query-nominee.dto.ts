import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryDto } from '../../../common/dto/query.dto';
import { Transform } from 'class-transformer';

export class NomineeQueryDto extends QueryDto {
  @ApiPropertyOptional({
    description: 'Filter by title',
    example: 'Dune',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by winner',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true) // Converts string "true"/"false" to boolean
  winner?: boolean;
}
