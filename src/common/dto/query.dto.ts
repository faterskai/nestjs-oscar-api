import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @ApiPropertyOptional({
    description: 'Sort by (field)',
    example: 'title',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order (asc or desc)',
    example: 'asc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: string;

  @ApiPropertyOptional({ description: 'Pagination - page number', example: 1 })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({
    description: 'Pagination - number of results per page',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}
