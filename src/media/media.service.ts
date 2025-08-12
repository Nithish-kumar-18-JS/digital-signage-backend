import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    try {
      return this.prisma.media.findMany({ where: { uploadedById: userId }, include: { playlistItems: true } });
    } catch (error) {
      throw error;
    }
  }
  findOne(id: number) {
    try {
      return this.prisma.media.findUnique({ where: { id }, include: { playlistItems: true } });
    } catch (error) {
      throw error;
    }
  }

  create(data: any, userId: number) {
    try {
      const mediaData = {
        ...data,
        uploadedById: userId,
      }
      return this.prisma.media.create({ data: mediaData });
    } catch (error) {
      throw error;
    }
  }

  update(id: number, data: any) {
    try {
      return this.prisma.media.update({ where: { id }, data });
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    try {
      return this.prisma.media.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  search(query: string) {
    try {
      return this.prisma.media.findMany({ where: { name: { contains: query, mode: 'insensitive' } } });
    } catch (error) {
      throw error;
    }
  }
}
