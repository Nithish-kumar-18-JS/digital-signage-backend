import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.schedule.findMany({ where: { createdById: userId }, include: { schedulePlaylists: true, screen: true } });
  }

  findOne(id: number) {
    return this.prisma.schedule.findUnique({ where: { id }, include: { schedulePlaylists: true, screen: true } });
  }

  create(data: any, userId: number) {
    const scheduleData = {
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      screen: data.screenId
      ? { connect: { id: data.screenId } }
      : undefined,
      createdBy: {
        connect: { id: userId },
      },
    }
    return this.prisma.schedule.create({ data: scheduleData });
  }

  update(id: number, data: any, userId: number) {
    const scheduleData = {
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      screen: data.screenId
      ? { connect: { id: data.screenId } }
      : undefined,
      createdBy: {
        connect: { id: userId },
      },
    }
    return this.prisma.schedule.update({ where: { id }, data: scheduleData });
  }

  remove(id: number) {
    return this.prisma.schedule.delete({ where: { id } });
  }
}
