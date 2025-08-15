import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import clerkClient from '@clerk/clerk-sdk-node';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string) {
   try {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });    
   } catch (error) {
    return null
   }
  }

  async findUser(id: number) {
   try {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });    
   } catch (error) {
    return null
   }
  }

  async create(data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
   try {
    return this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      },
    });
   } catch (error) {
    throw error
   }
  }
}
