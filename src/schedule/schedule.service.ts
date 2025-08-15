import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Priority } from '@prisma/client'; // Make sure your Prisma schema has Priority enum

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.schedule.findMany({
      where: { createdById: userId },
      include: { schedulePlaylists: true, screen: true },
    });
  }

  findOne(id: number) {
    return this.prisma.schedule.findUnique({
      where: { id },
      include: { schedulePlaylists: true, screen: true },
    });
  }

  async create(data: any, userId: number) {
    try {
      const { screenId, ...restData } = data;
      const scheduleData = {
        ...restData,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        priority:
          data.priority === 'high'
            ? Priority.HIGH
            : data.priority === 'medium'
            ? Priority.MEDIUM
            : Priority.LOW,
        screen: screenId ? { connect: { id: screenId } } : undefined,
        createdBy: {
          connect: { id: userId },
        },
      };
      return await this.prisma.schedule.create({ data: scheduleData });
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  }
  

  update(id: number, data: any, userId: number) {
    const { screenId, ...restData } = data;
    const scheduleData = {
      ...restData,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      priority:
        data.priority === 'high'
          ? Priority.HIGH
          : data.priority === 'medium'
          ? Priority.MEDIUM
          : Priority.LOW,
      screen: screenId ? { connect: { id: screenId } } : undefined,
      createdBy: {
        connect: { id: userId },
      },
    };
    return this.prisma.schedule.update({
      where: { id },
      data: scheduleData,
    });
  }

  remove(id: number) {
    return this.prisma.schedule.delete({ where: { id } });
  }
}
