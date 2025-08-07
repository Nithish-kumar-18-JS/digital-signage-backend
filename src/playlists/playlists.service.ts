import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PlaylistsService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.playlist.findMany({ where: { createdBy: { id: userId } }, include: { items: true } });
  }

  findOne(id: number) {
    return this.prisma.playlist.findUnique({ where: { id }, include: { items: true } });
  }

  create(data: any, userId: number) {
    const playlistData = {
      ...data,
      createdBy: { id: userId },
    }
    return this.prisma.playlist.create({ data: playlistData });
  }

  remove(id: number) {
    return this.prisma.playlist.delete({ where: { id } });
  }
}
