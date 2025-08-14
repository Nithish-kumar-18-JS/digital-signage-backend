import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { TokenAuthGuard } from 'src/auth/auth.guard';

@Controller('schedule')
@UseGuards(TokenAuthGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  async findAll(@Req() req) {
    return this.scheduleService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(Number(id));
  }

  @Post()
  async create(@Body() data: any, @Req() req) {
    return this.scheduleService.create(data, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any, @Req() req) {
    return this.scheduleService.update(Number(id), data, req.user.id);
  }
}
