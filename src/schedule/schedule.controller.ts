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
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @Req() req: AuthRequest
  ) {
    const clerkId = req?.user?.sub;
    if (!clerkId) throw new BadRequestException('Unauthorized');

    // 🔐 Optionally check that this user can update this schedule
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    const clerkId = req?.user?.sub;
    if (!clerkId) throw new BadRequestException('Unauthorized');

    // 🔐 Same note here — pass `clerkId` to enforce permissions if needed
    return this.scheduleService.remove(id);
  }
}
