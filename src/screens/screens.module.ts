import { Module } from '@nestjs/common';
import { ScreensService } from './screens.service';
import { ScreensController } from './screens.controller';
import { PrismaService } from 'src/prisma.service';
import { ClerkService } from 'src/clerk/clerk.service';
import { HelperService } from 'src/lib/helper';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [ScreensController],
  providers: [ScreensService,PrismaService,ClerkService,HelperService,AuthService],
})
export class ScreensModule {}
