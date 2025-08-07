import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { PrismaService } from 'src/prisma.service';
import { ClerkService } from 'src/clerk/clerk.service';
import { HelperService } from 'src/lib/helper';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService,PrismaService,ClerkService,HelperService,AuthService],
})
export class ScheduleModule {}
