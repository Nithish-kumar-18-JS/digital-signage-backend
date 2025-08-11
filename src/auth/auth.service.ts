import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomBytes } from 'crypto';
import { addDays, isBefore } from 'date-fns';

@Injectable()
export class AuthService {
  private readonly TOKEN_EXPIRY_DAYS = 7;

  constructor(private prisma: PrismaService) {}

  // Login: issue a token
  async login(userId: number): Promise<string> {
    const tokenValue = randomBytes(48).toString('hex');
    const expiresAt = addDays(new Date(), this.TOKEN_EXPIRY_DAYS);
    // findOneCreate if not exists
    // Upsert = update if exists, create if not
    await this.prisma.authToken.upsert({
      where: { id: userId }, // must be unique in your schema
      update: { token: tokenValue, expiresAt },
      create: { token: tokenValue, userId, expiresAt },
    });

  return tokenValue;
  }

  // Validate and refresh token
  async validateAndRefresh(token: string): Promise<{ userId: number, newToken: string }> {
    const record = await this.prisma.authToken.findUnique({ where: { token } });
    if (!record || isBefore(record.expiresAt, new Date())) {
      throw new UnauthorizedException('Token expired.');
    }
    
    if(record.expiresAt < new Date()){
      await this.prisma.authToken.delete({ where: { token } });
      return { userId: record.userId, newToken: "" };
    }
    return { userId: record.userId, newToken: token };
  }

  // Logout
  async logout(token: string) {
    await this.prisma.authToken.deleteMany({ where: { token } });
  }
}
