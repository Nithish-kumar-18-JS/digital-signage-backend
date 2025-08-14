import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ScreenOrientation, ScreenStatus } from '@prisma/client';

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
        status: data.status === 'online' ? ScreenStatus.ONLINE : ScreenStatus.OFFLINE,
        lastSeen: data.lastSeen,
        resolution: data.resolution,
        orientation: data.orientation === 'landscape' ? ScreenOrientation.LANDSCAPE : ScreenOrientation.PORTRAIT,
        createdBy: userId,
        playlist: data.playlistId
        ? { connect: { id: data.playlistId } }
        : undefined,
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
      status: data.status === 'online' ? ScreenStatus.ONLINE : ScreenStatus.OFFLINE,
      orientation: data.orientation === 'landscape' ? ScreenOrientation.LANDSCAPE : ScreenOrientation.PORTRAIT,
      playlist: data.playlistId
      ? { connect: { id: data.playlistId } }
      : undefined,
    }
    return this.prisma.screen.update({ where: { id }, data: screenData, include: { schedules: true, settings: true } });
  }
}
