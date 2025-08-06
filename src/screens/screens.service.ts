import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';

@Injectable()
export class ScreensService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createScreenDto: CreateScreenDto, clerkId: string) {
    const user = await this.verifyUser(clerkId);

    const playlistLinks = createScreenDto.playlistLinks?.length
      ? {
          create: createScreenDto.playlistLinks.map((playlistId) => ({
            playlistId,
            createdBy: user.id,
          })),
        }
      : undefined;

    return this.prisma.screen.create({
      data: {
        ...createScreenDto,
        createdBy: user.id,
        playlistLinks,
      },
    });
  }

  async findAll(clerkId: string) {
    const user = await this.verifyUser(clerkId);

    return this.prisma.screen.findMany({
      where: { createdBy: user.id },
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

    if (!screen) {
      throw new NotFoundException(`Screen with ID ${id} not found`);
    }

    return screen;
  }

  async update(id: number, updateScreenDto: UpdateScreenDto, clerkId: string) {
    const user = await this.verifyUser(clerkId);
    const screen = await this.findOne(id);

    if (screen.createdBy !== user.id) {
      throw new ForbiddenException('You do not have permission to update this screen');
    }

    const playlistLinks = updateScreenDto.playlistLinks?.length
      ? {
          create: updateScreenDto.playlistLinks.map((playlistId) => ({
            playlistId,
            createdBy: user.id,
          })),
        }
      : undefined;

    return this.prisma.screen.update({
      where: { id },
      data: {
        ...updateScreenDto,
        playlistLinks,
      },
    });
  }

  async remove(id: number, clerkId: string) {
    const user = await this.verifyUser(clerkId);
    const screen = await this.findOne(id);

    if (screen.createdBy !== user.id) {
      throw new ForbiddenException('You do not have permission to delete this screen');
    }

    return this.prisma.screen.delete({
      where: { id },
    });
  }

  private async verifyUser(clerkId: string) {
    const user = await this.prisma.user.findUnique({ where: { clerkId } });

    if (!user) {
      throw new ForbiddenException(`User with clerkId ${clerkId} not found`);
    }

    return user;
  }
}
