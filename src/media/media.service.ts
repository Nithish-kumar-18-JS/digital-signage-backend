import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MediaType } from '@prisma/client';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async createMedia(
    file: string,
    name: string,
    type: MediaType,
    clerkId: string,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!name) throw new BadRequestException('Name is required');

    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const formatType = (type: string) => {
      return type.replace(/s/g, '').toUpperCase().replace(/\s/g, '_') as MediaType;
    };
    

    const mediaData = {
      name,
      url: file,
      type: formatType(type),
      uploadedById: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      durationSeconds: 0,
    };

    return this.prisma.media.create({ data: mediaData });
  }

  async getAllMedia(clerkId: string, type?: MediaType) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const where: { uploadedById: number; type?: MediaType } = {
      uploadedById: user.id,
    };

    const formatType = (type: string) => {
      return type.toUpperCase().replace(/\s/g, '') as MediaType;
    }

    if (type) {
      where.type = formatType(type);
    }

    return this.prisma.media.findMany({ where });
  }

  async deleteMedia(clerkId: string, mediaId: number) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const media = await this.prisma.media.findFirst({
      where: { id: mediaId, uploadedById: user.id },
    });

    if (!media) {
      throw new NotFoundException('Media not found or access denied');
    }

    return this.prisma.media.delete({
      where: { id: mediaId },
    });
  }

  async updateMedia(clerkId: string, mediaId: number, mediaData: any) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.prisma.media.findFirst({
      where: { id: mediaId, uploadedById: user.id },
    });

    if (!existing) {
      throw new NotFoundException('Media not found or access denied');
    }

    const formatType = (type: string) => {
      return type.replace(/s/g, '').toUpperCase().replace(/\s/g, '') as MediaType;
    };

    if (mediaData.type) {
      mediaData.type = formatType(mediaData.type);
    }

    return this.prisma.media.update({
      where: { id: mediaId },
      data: mediaData,
    });
  }

  async searchMedia(clerkId: string, searchQuery: string, type?: MediaType) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const where: { uploadedById: number; name?: any; type?: MediaType } = {
      uploadedById: user.id,
    };

    if (searchQuery) {
      where.name = {
        contains: searchQuery,
        mode: 'insensitive',
      };
    }

    const formatType = (type: string) => {
      return type.replace(/s/g, '').toUpperCase().replace(/\s/g, '') as MediaType;
    };
    

    if (type) {
      where.type = formatType(type);
    }

    return this.prisma.media.findMany({ where });
  }
}
