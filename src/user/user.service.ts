import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import clerkClient from '@clerk/clerk-sdk-node';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateUser(clerkUser: string) {
  
    const clerkId = clerkUser;
  
    if (!clerkId) {
      throw new Error('Missing Clerk user ID');
    }
  
    const existing = await this.prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });
  
    if (existing) return existing;
  
    const user = await clerkClient.users.getUser(clerkUser);

    const created = await this.prisma.user.create({
      data: {
        clerkId,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  
    return created;
  }
}
  
