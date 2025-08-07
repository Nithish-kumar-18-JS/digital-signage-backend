import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { TokenAuthGuard } from 'src/auth/auth.guard';

@Controller('schedules')
@UseGuards(TokenAuthGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  async findAll(@Req() req) {
    return this.scheduleService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(Number(id));
  }

  @Post()
  async create(@Body() data: any, @Req() req) {
    return this.scheduleService.create(data, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(Number(id));
  }
}
