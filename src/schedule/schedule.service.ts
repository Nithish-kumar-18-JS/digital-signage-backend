import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateScheduleDto) {
    return this.prisma.playlistOnScreen.create({ data });
  }

  findAll() {
    return this.prisma.playlistOnScreen.findMany({
      include: {
        screen: true,
        playlist: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.playlistOnScreen.findUnique({
      where: { id },
      include: {
        screen: true,
        playlist: true,
      },
    });
  }

  async update(id: number, data: UpdateScheduleDto) {
    const existing = await this.prisma.playlistOnScreen.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Schedule not found');
    return this.prisma.playlistOnScreen.update({ where: { id }, data });
  }

  async remove(id: number) {
    const existing = await this.prisma.playlistOnScreen.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Schedule not found');
    return this.prisma.playlistOnScreen.delete({ where: { id } });
  }
}
