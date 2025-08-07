import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import clerkClient from '@clerk/clerk-sdk-node';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUser(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      },
    });
  }
}
