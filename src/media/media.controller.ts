import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  BadRequestException,
  Get,
  Query,
  Delete,
  Put,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { AuthGuard } from '../auth/auth.guard';
import { MediaType } from '@prisma/client';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @UseGuards(AuthGuard)
  @Post('add-media')
  async addMedia(
    @Body('url') file: string,
    @Body('name') name: string,
    @Body('type') type: string,
    @Req() req: any,
  ) {
    console.log({file,name,type});
    if (!file) throw new BadRequestException('No file provided');
    if (!name) throw new BadRequestException('Name is required');
    if (!req?.user?.sub) throw new BadRequestException('Unauthorized');

    return this.mediaService.createMedia(
      file,
      name,
      type as MediaType,
      req.user.sub,
    );
  }

  @UseGuards(AuthGuard)
  @Get('all-media')
  async getAllMedia(@Req() req: any, @Query('type') type: string) {
    if (!req?.user?.sub) throw new BadRequestException('Unauthorized');
    return this.mediaService.getAllMedia(req.user.sub, type as MediaType);
  }

  @UseGuards(AuthGuard)
  @Delete('delete-media')
  async deleteMedia(@Req() req: any, @Query('id') id: string) {
    if (!req?.user?.sub) throw new BadRequestException('Unauthorized');
    return this.mediaService.deleteMedia(req.user.sub, Number(id));
  }

  @UseGuards(AuthGuard)
  @Put('update-media')
  async updateMedia(
    @Req() req: any,
    @Query('id') id: string,
    @Body() mediaData: any,
  ) {
    if (!req?.user?.sub) throw new BadRequestException('Unauthorized');
    return this.mediaService.updateMedia(req.user.sub, Number(id), mediaData);
  }

  @UseGuards(AuthGuard)
  @Get('search-media')
  async searchMedia(@Req() req: any, @Query('search') query: string , @Query('type') type: string) {
    if (!req?.user?.sub) throw new BadRequestException('Unauthorized');
    return this.mediaService.searchMedia(req.user.sub, query, type as MediaType);
  }
}
