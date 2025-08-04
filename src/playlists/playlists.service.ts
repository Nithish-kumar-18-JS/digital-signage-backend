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
        name: dto.name, // or any other scalar fields
        createdById: userId,
        items: {
          create: dto.items || [],
        },
        screenLinks: {
          create: dto.screenLinks || [],
        },
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
    await this.findOne(id, clerkId); // ensures ownership
    return this.prisma.playlist.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        items: {
          deleteMany: dto.items?.map(item => ({ id: item.id })),
          create: dto.items?.map(item => ({
            playlistId: id,
            mediaId: item.mediaId,
            position: item.position,
            durationOverride: item.durationOverride,
            transitionEffect: item.transitionEffect,
          })),
        },
        screenLinks: {
          deleteMany: dto.screenLinks?.map(link => ({ id: link.id })),
          create: dto.screenLinks?.map(link => ({
            screenId: link.screenId,
            startTime: link.startTime,
            endTime: link.endTime,
            daysOfWeek: link.daysOfWeek,
            repeatDaily: link.repeatDaily,
            priority: link.priority,
          })),
        },
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
