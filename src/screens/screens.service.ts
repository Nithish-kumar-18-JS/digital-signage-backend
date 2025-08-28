import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ScreenOrientation, ScreenStatus } from '@prisma/client';
import { WebplayerGateway } from '../webplayer/webplayer.gateway';

@Injectable()
export class ScreensService {
  constructor(private prisma: PrismaService , private webplayerGateway: WebplayerGateway) {}
  async findAll(userId: number) {
    return await this.prisma.screen.findMany({ where: { createdBy: userId }, include: { schedules: true, settings: true } });
  }

  async findOne(id: number) {
    return await this.prisma.screen.findUnique({ where: { id }, include: { schedules: true, settings: true } });
  }

  async create(data: any, userId: number) {
    try {
      let response: any = {}
      response.data = await this.prisma.screen.create({
      data: {
        name: data.name,
        description: data.description,
        deviceId: data.deviceId,
        status: data.status === 'online' ? ScreenStatus.ONLINE : ScreenStatus.OFFLINE,
        lastSeen: data.lastSeen,
        resolution: data.resolution,
        orientation: data.orientation === 'landscape' ? ScreenOrientation.LANDSCAPE : ScreenOrientation.PORTRAIT,
        createdBy: userId,
        playlist: data.playlistId
        ? { connect: { id: data.playlistId } }
        : undefined,
      },
      include: {
        schedules: true,
        settings: true
      }
    });
    response.data.message = "Screen created successfully ID : " + response.data.id;
    return response;
    } catch (error) {
      let response: any = {}
      response.data.message = "Screen creation failed";
      throw error;
    }
  }
  
  async searchScreens(query: string) {
    return await this.prisma.screen.findMany({ where: { name: { contains: query, mode: 'insensitive' } } });
  }

  async remove(id: number) {
    try {
      let response: any = {}
      response.data = await this.prisma.screen.delete({ where: { id }, include: { schedules: true, settings: true } });
      response.data.message = "Screen deleted successfully ID : " + response.data.id;
      return response;
    } catch (error) {
      let response: any = {}
      response.data.message = "Screen deletion ID : " + id;
      throw error;
    }
  }

  async update(id: number, data: any) {
    const { playlistId, ...updateData } = data;
    const screenData = {
      ...updateData,
      status: data.status === 'online' ? ScreenStatus.ONLINE : ScreenStatus.OFFLINE,
      orientation: data.orientation === 'landscape' ? ScreenOrientation.LANDSCAPE : ScreenOrientation.PORTRAIT,
      playlist: playlistId
        ? { connect: { id: playlistId } }
        : undefined,
    }
    delete screenData.id;
    try {
    let response: any = {}
    let sendClientData:any = await this.prisma.screen.update({ where: { id }, data: screenData, include: { schedules: true, settings: true  , playlist: {
      include: {
        items: {
          include: {
            media: true
          }
        }
      }
    } } });
    response.data = sendClientData;
    response.data.message = "Screen updated successfully ID : " + response.data.id;
    sendClientData.screenUpdate = true;
    await this.webplayerGateway.sendMessageToAll('screenUpdated',JSON.stringify(sendClientData))
    return response;
    } catch (error) {
      let response: any = {}
      response.data.message = "Screen update failed";
      throw error;
    }
  }
}
