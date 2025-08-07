import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MediaService } from '../media/media.service';
import { TokenAuthGuard } from 'src/auth/auth.guard';
import { HelperService } from 'src/lib/helper';

@Controller('media')
@UseGuards(TokenAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService, private readonly helperService: HelperService) {}

  @Get()
  async findAll(@Req() req) {
    return this.mediaService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(Number(id));
  }

  @Post()
  async create(@Body() data: any, @Req() req) {
    return this.mediaService.create(data, req.user.userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.mediaService.remove(Number(id));
  }
}
