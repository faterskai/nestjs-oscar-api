import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { NomineesService } from './nominees.service';
import { CreateNomineeDto } from './dto/create-nominee.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NomineeQueryDto } from './dto/query-nominee.dto';
import { UpdateNomineeDto } from './dto/update-nominee.dto';
import { Nominee } from './schemas/nominee.schema';

@ApiTags('nominees')
@Controller('nominees')
export class NomineesController {
  constructor(private readonly nomineeService: NomineesService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new nominee' })
  @ApiResponse({ status: 201, description: 'Creates a new nominee' })
  async create(@Body() createNomineeDto: CreateNomineeDto): Promise<Nominee> {
    return this.nomineeService.create(createNomineeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Returns a list of nominees' })
  @ApiResponse({ status: 200, description: 'Returns a list of nominees' })
  async findAll(
    @Query() query: NomineeQueryDto,
  ): Promise<PaginatedResponse<Nominee>> {
    return this.nomineeService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns a specific nominee' })
  @ApiResponse({ status: 200, description: 'Returns a specific nominee' })
  async findOne(@Param('id') id: string): Promise<Nominee> {
    return this.nomineeService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifies a specific nominee' })
  @ApiResponse({ status: 201, description: 'Modifies a specific nominee' })
  async update(
    @Param('id') id: string,
    @Body() updateNomineeDto: UpdateNomineeDto,
  ): Promise<Nominee> {
    return this.nomineeService.update(id, updateNomineeDto);
  }
}
