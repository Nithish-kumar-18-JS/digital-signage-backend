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
  
    return this.prisma.playlist.create({
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
        screenLinks: dto.screenLinks ? {
          create: dto.screenLinks.map((screenId, index) => ({
            screenId,
            assignedAt: new Date(),
            startTime: null,
            endTime: null,
            daysOfWeek: null,
            repeatDaily: false,
            priority: index
          }))
        } : undefined,
      },
      include: {
        items: true,
        screenLinks: true,
      },
    });
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
    await this.prisma.playlistOnScreen.deleteMany({ where: { playlistId: id } });
  
    // Then update the playlist and re-create the relations
    return this.prisma.playlist.update({
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
        screenLinks: dto.screenLinks ? {
          create: dto.screenLinks.map((screenId, index) => ({
            screenId,
            assignedAt: new Date(),
            startTime: null,
            endTime: null,
            daysOfWeek: null,
            repeatDaily: false,
            priority: index,
          }))
        } : undefined,
      },
      include: {
        items: true,
        screenLinks: true,
      },
    });
  }
  
  async remove(id: number, clerkId: string): Promise<Playlist> {
    await this.findOne(id, clerkId); // ensures ownership
    return this.prisma.playlist.delete({
      where: { id },
    });
  }
}
