import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { Playlist } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @UseGuards(AuthGuard)
  @Post('/add-playlist')
  create(@Body() createPlaylistDto: CreatePlaylistDto, @Req() req: any) {
    return this.playlistsService.create(createPlaylistDto, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('/all-playlists')
  findAll(@Req() req: any) {
    return this.playlistsService.findAll(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.playlistsService.findOne(+id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto, @Req() req: any) {
    return this.playlistsService.update(+id, updatePlaylistDto, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.playlistsService.remove(+id, req.user.sub);
  }
}
