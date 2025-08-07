import { Module } from '@nestjs/common';
import { HelperService } from './helper';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [HelperService, PrismaService],
  exports: [HelperService],
})
export class HelperModule {}