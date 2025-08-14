import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ScreensService {
  constructor(private prisma: PrismaService) {}
  findAll(userId: number) {
    return this.prisma.screen.findMany({ where: { createdBy: userId }, include: { schedules: true, settings: true } });
  }

  findOne(id: number) {
    return this.prisma.screen.findUnique({ where: { id }, include: { schedules: true, settings: true } });
  }

  create(data: any, userId: number) {
    return this.prisma.screen.create({
      data: {
        name: data.name,
        description: data.description,
        deviceId: data.deviceId,
        status: data.status,
        lastSeen: data.lastSeen,
        resolution: data.resolution,
        orientation: data.orientation,
        createdBy: userId,
        playlists: {
          create: data.playlists.map((playlistId: number, index: number) => ({
            playlist: { connect: { id: playlistId } },
            position: index
          }))
        }
      },
      include: {
        schedules: true,
        settings: true
      }
    });
  }
  
  searchScreens(query: string) {
    return this.prisma.screen.findMany({ where: { name: { contains: query, mode: 'insensitive' } } });
  }

  remove(id: number) {
    return this.prisma.screen.delete({ where: { id }, include: { schedules: true, settings: true } });
  }

  update(id: number, data: any) {
    const screenData = {
      ...data,
      playlists: {
        deleteMany: [],
        create: data.playlists.map((playlistId: number, index: number) => ({
          playlist: { connect: { id: playlistId } },
          position: index,
        })),
      },
    }
    return this.prisma.screen.update({ where: { id }, data: screenData, include: { schedules: true, settings: true } });
  }
}
