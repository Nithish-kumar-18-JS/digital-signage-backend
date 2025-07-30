import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MediaType } from '@prisma/client';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async createMedia(
    file: Express.Multer.File,
    name: string,
    type: MediaType,
    clerkId: string,
  ) {
    if (!file) throw new Error('No file uploaded');
    if (!name) throw new Error('Name is required');

    const imageBase64 = file.buffer.toString('base64');

    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const mediaData = {
      name,
      url: `data:${file.mimetype};base64,${imageBase64}`, // <- dynamic MIME type
      type: type,
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
      throw new Error('User not found');
    }

    const where: { uploadedById: string; type?: MediaType } = {
      uploadedById: user.id,
    };

    if (type) {
      where.type = type;
    }
    const response = await this.prisma.media.findMany({
      where,
    });
    return response;
  }

  async deleteMedia(clerkId: string, mediaId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.prisma.media.delete({
      where: { id: mediaId, uploadedById: user.id },
    });
  }

  async updateMedia(clerkId: string, mediaId: string, mediaData: any) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.prisma.media.update({
      where: { id: mediaId, uploadedById: user.id },
      data: mediaData,
    });
  }
}
