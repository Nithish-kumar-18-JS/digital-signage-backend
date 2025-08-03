import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { PrismaService } from 'src/prisma.service';
import { ClerkService } from 'src/clerk/clerk.service';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService,PrismaService,ClerkService],
})
export class ScheduleModule {}
