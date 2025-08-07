import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ScreensService } from '../screens/screens.service';
import { TokenAuthGuard } from 'src/auth/auth.guard';

@Controller('screens')
@UseGuards(TokenAuthGuard)
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @Get()
  async findAll(@Req() req) {
    return this.screensService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.screensService.findOne(Number(id));
  }

  @Post()
  async create(@Body() data: any, @Req() req) {
    return this.screensService.create(data, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.screensService.remove(Number(id));
  }
}
