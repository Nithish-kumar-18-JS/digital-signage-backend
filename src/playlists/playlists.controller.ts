import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PlaylistsService } from '../playlists/playlists.service';
import { TokenAuthGuard } from 'src/auth/auth.guard';
  
@Controller('playlists')
@UseGuards(TokenAuthGuard)
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get()
  async findAll(@Req() req) {
    return this.playlistsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistsService.findOne(Number(id));
  }

  @Post()
  async create(@Body() data: any, @Req() req) {
    return this.playlistsService.create(data, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistsService.remove(Number(id));
  }
}
