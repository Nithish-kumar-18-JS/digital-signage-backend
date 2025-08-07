import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { PrismaService } from 'src/prisma.service';
import { ClerkService } from 'src/clerk/clerk.service';
import { HelperService } from 'src/lib/helper';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [PlaylistsController],
  providers: [PlaylistsService,PrismaService,ClerkService,HelperService,AuthService],
})
export class PlaylistsModule {}
