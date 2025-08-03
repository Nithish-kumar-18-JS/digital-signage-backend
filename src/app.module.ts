import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClerkService } from './clerk/clerk.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { PrismaService } from './prisma.service';
import { MediaService } from './media/media.service';
import { MediaController } from './media/media.controller';
import { UploadController } from './upload/upload.controller';
import { R2Service } from './upload/r2.service';
import { PlaylistsModule } from './playlists/playlists.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ScreensModule } from './screens/screens.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PlaylistsModule,
    ScheduleModule,
    ScreensModule,
  ],
  providers: [ClerkService, UserService, PrismaService, MediaService, R2Service],
  controllers: [UserController, MediaController, UploadController],
})
export class AppModule {}
