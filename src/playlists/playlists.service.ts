import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PlaylistsService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.playlist.findMany({ where: { createdBy: { id: userId } }, include: { items: {
      include: {
        media: true
      }
    } } });
  }

  findOne(id: number) {
    return this.prisma.playlist.findUnique({ where: { id }, include: { items: {
      include: {
        media: true
      }
    } } });
  }

  async create(data: any, userId: number) {
    try {
      return await this.prisma.playlist.create({
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  


  update(id: number, data: any) {
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
    return this.prisma.playlist.update({ where: { id }, data: playlistData });
  }

  remove(id: number) {
    return this.prisma.playlist.delete({ where: { id } });
  }

  searchPlaylists(query: string) {
    return this.prisma.playlist.findMany({ where: { name: { contains: query, mode: 'insensitive' } } });
  }
}
