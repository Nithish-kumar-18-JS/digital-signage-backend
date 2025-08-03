import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MediaType } from '@prisma/client';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  private async getUserByClerkId(clerkId: string) {
    const user = await this.prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private parseMediaType(type: string): MediaType {
    return type.replace(/s$/i, '').toUpperCase().replace(/\s/g, '') as MediaType;
  }

  async createMedia(dto: CreateMediaDto, clerkId: string) {
    const user = await this.getUserByClerkId(clerkId);
    const mediaData = {
      name: dto.name,
      url: dto.url,
      type: this.parseMediaType(dto.type),
      uploadedById: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      durationSeconds: 0,
    };
    return this.prisma.media.create({ data: mediaData });
  }

  async getAllMedia(clerkId: string, type?: string) {
    const user = await this.getUserByClerkId(clerkId);
    const where: any = { uploadedById: user.id };
    if (type) where.type = this.parseMediaType(type);
    return this.prisma.media.findMany({ where });
  }

  async findOne(clerkId: string, mediaId: number) {
    const user = await this.getUserByClerkId(clerkId);
    const media = await this.prisma.media.findFirst({
      where: { id: mediaId, uploadedById: user.id },
    });
    if (!media) throw new NotFoundException('Media not found or access denied');
    return media;
  }

  async updateMedia(clerkId: string, mediaId: number, data: UpdateMediaDto) {
    const user = await this.getUserByClerkId(clerkId);
    const existing = await this.prisma.media.findFirst({
      where: { id: mediaId, uploadedById: user.id },
    });
    if (!existing) throw new NotFoundException('Media not found or access denied');

    if (data.type) data.type = this.parseMediaType(data.type);

    return this.prisma.media.update({
      where: { id: mediaId },
      data,
    });
  }

  async deleteMedia(clerkId: string, mediaId: number) {
    const user = await this.getUserByClerkId(clerkId);
    const media = await this.prisma.media.findFirst({
      where: { id: mediaId, uploadedById: user.id },
    });
    if (!media) throw new NotFoundException('Media not found or access denied');
    return this.prisma.media.delete({ where: { id: mediaId } });
  }

  async searchMedia(clerkId: string, query: string, type?: string) {
    const user = await this.getUserByClerkId(clerkId);
    const where: any = {
      uploadedById: user.id,
    };

    if (query) {
      where.name = {
        contains: query,
        mode: 'insensitive',
      };
    }

    if (type) {
      where.type = this.parseMediaType(type);
    }

    return this.prisma.media.findMany({ where });
  }
}
