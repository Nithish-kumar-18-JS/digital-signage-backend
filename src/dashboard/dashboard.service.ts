import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {

  constructor(private readonly prisma: PrismaService) {
    
  }

  async getDashboard(userId: number) {
     let dashboardData = {
      screens: {
        total : 0,
        recentlyAdded :0,
        active : 0,
        inactive : 0,
      },
      playlists: {
        total : 0,
        online :0,
      },
      media: {
        total : 0,
        recentlyAdded :0,
      },
      activityLogs : {}
     }

     let screens = await this.prisma.screen.findMany({
      where: {
        createdBy: userId,
      },
     })

     let inactiveScreens = await this.prisma.screen.findMany({
      where: {
        createdBy: userId,
        status: 'OFFLINE',
      },
     })

     let recentlyAddedScreens = await this.prisma.screen.findMany({
      where: {
        createdBy: userId,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
     })

     let playlists = await this.prisma.playlist.findMany({
      where: {
        createdBy: {
          id: userId,
        },
      },
     })

     const onlinePlaylistCount = await this.prisma.playlist.count({
      where: {
        screens: {
          some: {
            status: 'ONLINE',
          },
        },
      },
    });
   
    const totalMediaCount = await this.prisma.media.count({
      where: {
        uploadedBy: {
          id: userId,
        },
      },
    });

    const recentlyAddedMediaCount = await this.prisma.media.count({
      where: {
        uploadedBy: {
          id: userId,
        },
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    });

    let activityLogs:any = await this.prisma.auditLog.findMany({
      where: {
        userId: userId,
        response: {
          contains: 'message',
      }
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
    activityLogs = activityLogs.map((log,index) => {
      let parseResponse = JSON.parse(log.response)
      if(parseResponse.data?.message){
        return {
          response: parseResponse.data.message,
          createdAt: log.createdAt,
        }
      }
    })

     dashboardData.screens.total = screens.length;
     dashboardData.screens.active = screens.filter(screen => screen.status === 'ONLINE').length;
     dashboardData.screens.inactive = inactiveScreens.length;
     dashboardData.screens.recentlyAdded = recentlyAddedScreens.length;

     dashboardData.playlists.total = playlists.length;
     dashboardData.playlists.online = onlinePlaylistCount;

     dashboardData.media.total = totalMediaCount;
     dashboardData.media.recentlyAdded = recentlyAddedMediaCount;

     dashboardData.activityLogs = activityLogs;

     return dashboardData;
  }
}
