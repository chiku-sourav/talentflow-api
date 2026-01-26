import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateDeveloperDto } from '../dto/create-developer.dto';
import { QueryDeveloperDto } from '../dto/query-developer.dto';
import { UpdateDeveloperDto } from '../dto/update-developer.dto';
import { DevelopersService } from './developers.service';

@Controller('developers')
export class DevelopersController {
  constructor(private readonly service: DevelopersService) {}

  @Post()
  create(@Body() dto: CreateDeveloperDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryDeveloperDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDeveloperDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
