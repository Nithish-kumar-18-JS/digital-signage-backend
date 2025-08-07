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

  create(data: any, userId  : number) {
    const screenData = {
      ...data,
      createdBy: userId,
    }
    return this.prisma.screen.create({ data: screenData, include: { schedules: true, settings: true } });
  }

  remove(id: number) {
    return this.prisma.screen.delete({ where: { id }, include: { schedules: true, settings: true } });
  }
}
