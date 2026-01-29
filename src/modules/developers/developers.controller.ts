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
import { DevelopersService } from './developers.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { QueryDeveloperDto } from './dto/query-developer.dto';

@Controller({ path: 'developers', version: '1' })
export class DevelopersController {
  public constructor(private readonly developersService: DevelopersService) {}

  @Post()
  public create(@Body() dto: CreateDeveloperDto) {
    return this.developersService.create(dto);
  }

  @Get()
  public findAll(@Query() query: QueryDeveloperDto) {
    return this.developersService.findAll(query);
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.developersService.findOne(id);
  }

  @Patch(':id')
  public update(@Param('id') id: string, @Body() dto: UpdateDeveloperDto) {
    return this.developersService.update(id, dto);
  }

  @Delete(':id')
  public remove(@Param('id') id: string) {
    return this.developersService.remove(id);
  }
}
