import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist } from '@prisma/client';

@Injectable()
export class PlaylistsService {
  constructor(private prisma: PrismaService) {}

  private async getUserId(clerkId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new NotFoundException('User not found');
    return user.id;
  }

  async create(dto: CreatePlaylistDto, clerkId: string): Promise<Playlist> {
    const userId = await this.getUserId(clerkId);
  
    // Step 1: Create the playlist and its items
    const playlist = await this.prisma.playlist.create({
      data: {
        name: dto.name,
        description: dto.description,
        createdById: userId,
        items: dto.items ? {
          create: dto.items.map((mediaId, index) => ({
            mediaId,
            position: index,
            durationOverride: null,
            transitionEffect: null
          }))
        } : undefined,
      },
      include: {
        items: true,
        playlistOnScreenPlaylists: true,
      },
    });

    // Step 2: Link playlist to screens if provided
    if (dto.screenLinks && dto.screenLinks.length > 0) {
      for (let i = 0; i < dto.screenLinks.length; i++) {
        const screenId = dto.screenLinks[i];
        // Create PlaylistOnScreen
        const playlistOnScreen = await this.prisma.playlistOnScreen.create({
          data: {
            screenId,
            assignedAt: new Date(),
            startTime: null,
            endTime: null,
            daysOfWeek: null,
            repeatDaily: false,
            priority: i,
            createdBy: userId,
          },
        });
        // Create PlaylistOnScreenPlaylist
        await this.prisma.playlistOnScreenPlaylist.create({
          data: {
            playlistId: playlist.id,
            playlistOnScreenId: playlistOnScreen.id,
          },
        });
      }
    }
    return playlist;
  }

  async findAll(clerkId: string): Promise<Playlist[]> {
    const userId = await this.getUserId(clerkId);
    return this.prisma.playlist.findMany({
      where: { createdById: userId },
    });
  }

  async findOne(id: number, clerkId: string): Promise<Playlist> {
    const userId = await this.getUserId(clerkId);
    const playlist = await this.prisma.playlist.findUnique({
      where: { id , createdById: userId },
    });
    if (!playlist) throw new NotFoundException('Playlist not found');
    return playlist;
  }

  async update(id: number, dto: UpdatePlaylistDto, clerkId: string): Promise<Playlist> {
    await this.findOne(id, clerkId); // verifies ownership
  
    // First, delete existing items and screenLinks
    await this.prisma.playlistItem.deleteMany({ where: { playlistId: id } });
    await this.prisma.playlistOnScreenPlaylist.deleteMany({ where: { playlistId: id } });
  
    // Then update the playlist and re-create the relations
    const playlist = await this.prisma.playlist.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        items: dto.items ? {
          create: dto.items.map((mediaId, index) => ({
            mediaId,
            position: index,
            durationOverride: null,
            transitionEffect: null,
          }))
        } : undefined,
      },
      include: {
        items: true,
        playlistOnScreenPlaylists: true,
      },
    });

    // If screenLinks provided, create PlaylistOnScreen and PlaylistOnScreenPlaylist records
    if (dto.screenLinks && dto.screenLinks.length > 0) {
      const userId = await this.getUserId(clerkId);
      for (let i = 0; i < dto.screenLinks.length; i++) {
        const screenId = dto.screenLinks[i];
        const playlistOnScreen = await this.prisma.playlistOnScreen.create({
          data: {
            screenId,
            assignedAt: new Date(),
            startTime: null,
            endTime: null,
            daysOfWeek: null,
            repeatDaily: false,
            priority: i,
            createdBy: userId,
          },
        });
        await this.prisma.playlistOnScreenPlaylist.create({
          data: {
            playlistId: playlist.id,
            playlistOnScreenId: playlistOnScreen.id,
          },
        });
      }
    }
    return playlist;
  }
  
  async remove(id: number, clerkId: string): Promise<Playlist> {
    await this.findOne(id, clerkId); // ensures ownership
    return this.prisma.playlist.delete({
      where: { id },
    });
  }
}
