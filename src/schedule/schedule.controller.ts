import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthRequest } from 'src/types/auth-request';

@Controller('schedule')
@UseGuards(AuthGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(
    @Body() createScheduleDto: CreateScheduleDto,
    @Req() req: AuthRequest
  ) {
    const clerkId = req?.user?.sub;
    if (!clerkId) throw new BadRequestException('Unauthorized');
    
    // 🔍 Optionally validate ownership of screenId/playlistId in service
    return this.scheduleService.create(createScheduleDto, clerkId);
  }

  @Get()
  findAll(@Req() req: AuthRequest) {
    const clerkId = req?.user?.sub;
    if (!clerkId) throw new BadRequestException('Unauthorized');
    return this.scheduleService.findAll(clerkId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    const clerkId = req?.user?.sub;
    if (!clerkId) throw new BadRequestException('Unauthorized');
    return this.scheduleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.remove(id);
  }
}
