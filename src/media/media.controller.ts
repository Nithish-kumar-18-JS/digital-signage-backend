import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Request } from 'express';
import { AuthRequest } from 'src/types/auth-request';

@Controller('media')
@UseGuards(AuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  async create(@Body() dto: CreateMediaDto, @Req() req: AuthRequest) {
    const clerkId = req?.user?.sub;
    if (!clerkId) throw new BadRequestException('Unauthorized');
    return this.mediaService.createMedia(dto, clerkId);
  }

  @Get('/all-media')
  async findAll(@Req() req: AuthRequest, @Query('type') type?: string) {
    const clerkId = req?.user?.sub;
    if (!clerkId) throw new BadRequestException('Unauthorized');
    return this.mediaService.getAllMedia(clerkId, type);
  }

  @Get('search')
  async search(@Req() req: AuthRequest, @Query('search') q: string, @Query('type') type?: string) {
    const clerkId = req?.user?.sub;
    if (!clerkId) throw new BadRequestException('Unauthorized');
    return this.mediaService.searchMedia(clerkId, q, type);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    const clerkId = req?.user?.sub;
    if (!clerkId) throw new BadRequestException('Unauthorized');
    return this.mediaService.findOne(clerkId, +id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMediaDto, @Req() req: AuthRequest) {
    const clerkId = req?.user?.sub;
    if (!clerkId) throw new BadRequestException('Unauthorized');
    return this.mediaService.updateMedia(clerkId, +id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: AuthRequest) {
    const clerkId = req?.user?.sub;
    if (!clerkId) throw new BadRequestException('Unauthorized');
    return this.mediaService.deleteMedia(clerkId, +id);
  }
}
