import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { MediaService } from '../media/media.service';
import { TokenAuthGuard } from 'src/auth/auth.guard';

@Controller('media')
@UseGuards(TokenAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  async findAll(@Req() req) {
    return this.mediaService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(Number(id));
  }

  @Post()
  async create(@Body() data: any, @Req() req) {
    return this.mediaService.create(data, req.user.id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.mediaService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.mediaService.remove(Number(id));
  }
}
