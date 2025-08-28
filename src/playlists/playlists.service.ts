import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PlaylistsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return await this.prisma.playlist.findMany({ where: { createdBy: { id: userId } }, include: { items: {
      include: {
        media: true
      }
    } } });
  }

  async findOne(id: number) {
    return await this.prisma.playlist.findUnique({ where: { id }, include: { items: {
      include: {
        media: true
      }
    } } });
  }

  async create(data: any, userId: number) {
    try {
      let response: any = {}
      response.data = await this.prisma.playlist.create({
        data: {
          name: data.name,
          description: data.description,
          createdBy: {
            connect: { id: userId },
          },
          items: {
            create: data.items.map((mediaId: number, index: number) => ({
              media: { connect: { id: mediaId } },
              position: index,
            })),
          },
        },
      });
      response.data.message = "Playlist created successfully ID : " + response.data.id;
      return response;
    } catch (error) {
      let response: any = {}
      response.data.message = "Playlist creation failed";
      throw error;
    }
  }
  


  async update(id: number, data: any) {
    try {
      const playlistData = {
        name: data.name,
        description: data.description,
        items: {
          deleteMany: [],
          create: data.items.map((mediaId: number, index: number) => ({
            media: { connect: { id: mediaId } },
            position: index,
          })),
        },
      }
      let response: any = {}
      response.data = await this.prisma.playlist.update({ where: { id }, data: playlistData });
      response.data.message = "Playlist updated successfully ID : " + response.data.id;
      return response;
    } catch (error) {
      let response: any = {}
      response.data.message = "Playlist update ID : " + id;
      throw error;
    }
  }

  async remove(id: number) {
    try {
      let response: any = {}
      response.data = await this.prisma.playlist.delete({ where: { id } });
      response.data.message = "Playlist deleted successfully ID : " + response.data.id;
      return response;
    } catch (error) {
      let response: any = {}
      response.data.message = "Playlist deletion ID : " + id;
      throw error;
    }
  }

  async searchPlaylists(query: string) {
    return await this.prisma.playlist.findMany({ where: { name: { contains: query, mode: 'insensitive' } } });
  }
}
