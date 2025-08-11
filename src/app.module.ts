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
import { ScreensService } from './screens/screens.service';
import { ScheduleService } from './schedule/schedule.service';
import { PlaylistsService } from './playlists/playlists.service';
import { HelperModule } from './lib/helper.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { CustomLogger } from './common/logger/custom-logger';
import { AuditInterceptor } from './common/logger/audit-interceptor';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HelperModule,
    PlaylistsModule,
    ScheduleModule,
    ScreensModule,
  ],
  providers: [ClerkService, UserService, PrismaService, MediaService, R2Service,ScreensService,ScheduleService,PlaylistsService,AuthService,CustomLogger,AuditInterceptor],
  controllers: [UserController, MediaController, UploadController,AuthController],
})
export class AppModule {}
