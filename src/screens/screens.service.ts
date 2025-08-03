import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';

@Injectable()
export class ScreensService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createScreenDto: CreateScreenDto, clerkId: string) {
    const user = await this.prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new NotFoundException('User not found');

    // You may link the screen to a user if needed
    return this.prisma.screen.create({
      data: {
        ...createScreenDto,
      },
    });
  }

  findAll() {
    return this.prisma.screen.findMany({
      include: {
        playlistLinks: true,
        settings: true,
      },
    });
  }

  async findOne(id: number) {
    const screen = await this.prisma.screen.findUnique({
      where: { id },
      include: {
        playlistLinks: true,
        settings: true,
      },
    });
    if (!screen) throw new NotFoundException('Screen not found');
    return screen;
  }

  async update(id: number, updateScreenDto: UpdateScreenDto, clerkId: string) {
    await this.verifyUser(clerkId);
    await this.findOne(id); // ensure screen exists

    return this.prisma.screen.update({
      where: { id },
      data: updateScreenDto,
    });
  }

  async remove(id: number, clerkId: string) {
    await this.verifyUser(clerkId);
    await this.findOne(id); // ensure screen exists

    return this.prisma.screen.delete({
      where: { id },
    });
  }

  private async verifyUser(clerkId: string) {
    const user = await this.prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new ForbiddenException('Access denied');
    return user;
  }
}
