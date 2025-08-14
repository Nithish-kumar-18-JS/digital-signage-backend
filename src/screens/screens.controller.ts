import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Patch, Put, Query } from '@nestjs/common';
import { ScreensService } from '../screens/screens.service';
import { TokenAuthGuard } from 'src/auth/auth.guard';

@Controller('screen')
@UseGuards(TokenAuthGuard)
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @Get()
  async findAll(@Req() req) {
    return this.screensService.findAll(req.user.id);
  }

  @Get('/search')
  async searchScreens(@Query('query') query: string) {
    return this.screensService.searchScreens(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.screensService.findOne(Number(id));
  }

  @Post()
  async create(@Body() data: any, @Req() req) {
    return this.screensService.create(data, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.screensService.remove(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.screensService.update(Number(id), data);
  }
}
