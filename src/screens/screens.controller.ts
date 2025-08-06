import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ScreensService } from './screens.service';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthRequest } from 'src/types/auth-request';

@Controller('screens')
@UseGuards(AuthGuard)
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @Post()
  create(@Body() createScreenDto: CreateScreenDto, @Req() req: AuthRequest) {
    const clerkId = req?.user?.sub;
    if (!clerkId) throw new BadRequestException('Unauthorized');
    return this.screensService.create(createScreenDto, clerkId);
  }

  @Get()
  findAll(@Req() req: AuthRequest) {
    const clerkId = req?.user?.sub;
    if (!clerkId) throw new BadRequestException('Unauthorized');
    return this.screensService.findAll(clerkId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.screensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScreenDto: UpdateScreenDto, @Req() req: AuthRequest) {
    const clerkId = req?.user?.sub;
    if (!clerkId) throw new BadRequestException('Unauthorized');
    return this.screensService.update(+id, updateScreenDto, clerkId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    const clerkId = req?.user?.sub;
    if (!clerkId) throw new BadRequestException('Unauthorized');
    return this.screensService.remove(+id, clerkId);
  }
}
