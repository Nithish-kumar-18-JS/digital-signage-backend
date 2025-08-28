import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Priority } from '@prisma/client'; // Make sure your Prisma schema has Priority enum

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return await this.prisma.schedule.findMany({
      where: { createdById: userId },
      include: { schedulePlaylists: true, screen: true },
    });
  }

  async findOne(id: number) {
    return await this.prisma.schedule.findUnique({
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
      let response: any = {}
      response.data = await this.prisma.schedule.create({ data: scheduleData });
      response.data.message = "Schedule created successfully ID : " + response.data.id;
      return response;
    } catch (error) {
      let response: any = {}
      response.data.message = "Schedule creation failed";
      throw error;
    }
  }
  

  async update(id: number, data: any, userId: number) {
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
    try {
      let response: any = {}
      response.data = await this.prisma.schedule.update({ where: { id }, data: scheduleData });
      response.data.message = "Schedule updated successfully ID : " + response.data.id;
      return response;
    } catch (error) {
      let response: any = {}
      response.data.message = "Schedule update ID : " + id;
      throw error;
    }
  }

  async remove(id: number) {
    try {
      let response: any = {}
      response.data = await this.prisma.schedule.delete({ where: { id } });
      response.data.message = "Schedule deleted successfully ID : " + response.data.id;
      return response;
    } catch (error) {
      let response: any = {}
      response.data.message = "Schedule deletion ID : " + id;
      throw error;
    }
  }
}
