// src/lib/helper.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class HelperService {
  constructor(private prisma: PrismaService) {}

  async getUserId(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    return user.id;
  }
}
