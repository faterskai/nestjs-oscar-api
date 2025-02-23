import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryDto } from '../../../common/dto/query.dto';

export class NomineeQueryDto extends QueryDto {
  @ApiPropertyOptional({
    description: 'Filter by title',
    example: 'Dune',
  })
  @IsOptional()
  @IsString()
  title?: string;
}
