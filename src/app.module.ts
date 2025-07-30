import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClerkService } from './clerk/clerk.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { PrismaService } from './prisma.service';
import { MediaService } from './media/media.service';
import { MediaController } from './media/media.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [ClerkService, UserService, PrismaService, MediaService],
  controllers: [UserController, MediaController],
})
export class AppModule {}
