import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClerkService } from './clerk/clerk.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  })],
  providers: [ClerkService, UserService, PrismaService],
  controllers: [UserController],
})
export class AppModule {}
