import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.media.findMany({ where: { uploadedById: userId }, include: { playlistItems: true } });
  }
  findOne(id: number) {
    return this.prisma.media.findUnique({ where: { id }, include: { playlistItems: true } });
  }

  create(data: any, userId: number) {
    const mediaData = {
      ...data,
      uploadedBy: { id: userId },
    }
    return this.prisma.media.create({ data: mediaData });
  }

  remove(id: number) {
    return this.prisma.media.delete({ where: { id } });
  }
}
