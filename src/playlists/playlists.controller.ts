import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Put, Query } from '@nestjs/common';
import { PlaylistsService } from '../playlists/playlists.service';
import { TokenAuthGuard } from 'src/auth/auth.guard';
  
@Controller('playlist')
@UseGuards(TokenAuthGuard)
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get()
  async findAll(@Req() req) {
    return this.playlistsService.findAll(req.user.id);
  }

  @Get('/search')
  async searchPlaylists(@Query('query') query: string) {
    return this.playlistsService.searchPlaylists(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistsService.findOne(Number(id));
  }

  @Post()
  async create(@Body() data: any, @Req() req) {
    console.log(req.user.id);
    return this.playlistsService.create(data, req.user.id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any, @Req() req) {
    return this.playlistsService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistsService.remove(Number(id));
  }
}
