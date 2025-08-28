import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    try {
      return await this.prisma.media.findMany({ where: { uploadedById: userId }, include: { playlistItems: true } });
    } catch (error) {
      throw error;
    }
  }
  async findOne(id: number) {
    try {
      return await this.prisma.media.findUnique({ where: { id }, include: { playlistItems: true } });
    } catch (error) {
      throw error;
    }
  }

  async create(data: any, userId: number) {
    try {
      const mediaData = {
        ...data,
        uploadedById: userId,
      }
      let response: any = {}
      response.data = await this.prisma.media.create({ data: mediaData });
      response.data.message = "Media created successfully ID : " + response.data.id;
      return response;
    } catch (error) {
      let response: any = {}
      response.data.message = "Media creation failed";
      throw error;
    }
  }

  async update(id: number, data: any) {
    try {
      let response: any = {}
      response.data = await this.prisma.media.update({ where: { id }, data });
      response.data.message = "Media updated successfully ID : " + response.data.id;
      return response;
    } catch (error) {
      let response: any = {}
      response.data.message = "Media update ID : " + id;
      throw error;
    }
  }

  async remove(id: number) {
    try {
      let response: any = {}
      console.log(typeof id)
      response.data = await this.prisma.media.delete({ where: { id } });
      response.data.message = "Media deleted successfully ID : " + id;
      return response;
    } catch (error) {
      let response: any = {}
      response.data.message = "Media deletion ID : " + id;
      throw error;
    }
  }

  async search(query: string) {
    try {
      return await this.prisma.media.findMany({ where: { name: { contains: query, mode: 'insensitive' } } });
    } catch (error) {
      throw error;
    }
  }
}
