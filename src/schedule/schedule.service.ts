import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateScheduleDto, clerkId: string) {
    const userId = await this.getUserId(clerkId);
    let scheduleData = {
      ...data,
      playlists: data.playlists ? {
        create: data.playlists.map((playlistId) => ({ playlistId })),
      } : undefined,
      createdBy: userId,
    };
    return this.prisma.playlistOnScreen.create({ data: scheduleData });
  }

  async findAll(clerkId: string) {
    const userId = await this.getUserId(clerkId);
    return this.prisma.playlistOnScreen.findMany({
      where: { createdBy: userId },
      include: {
        screen: true,
        playlists: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.playlistOnScreen.findUnique({
      where: { id },
      include: {
        screen: true,
        playlists: true,
      },
    });
  }

  async update(id: number, data: UpdateScheduleDto) {
    const existing = await this.prisma.playlistOnScreen.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Schedule not found');
    return this.prisma.playlistOnScreen.update({ where: { id }, data: { ...data, playlists: data.playlists ? { create: data.playlists.map((playlistId) => ({ playlistId })) } : undefined } });
  }

  async remove(id: number) {
    const existing = await this.prisma.playlistOnScreen.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Schedule not found');
    return this.prisma.playlistOnScreen.delete({ where: { id } });
  }

  private async getUserId(clerkId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new NotFoundException('User not found');
    return user.id;
  }
}
