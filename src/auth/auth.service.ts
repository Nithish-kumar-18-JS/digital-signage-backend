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
    await this.prisma.authToken.create({
      data: { token: tokenValue, userId, expiresAt }
    });
    return tokenValue;
  }

  // Validate and refresh token
  async validateAndRefresh(token: string): Promise<{ userId: number, newToken: string }> {
    const record = await this.prisma.authToken.findUnique({ where: { token } });
    if (!record || isBefore(record.expiresAt, new Date())) {
      throw new UnauthorizedException('Token expired.');
    }

    // Rotate: issue a new token, delete the old
    const newTokenValue = randomBytes(48).toString('hex');
    const newExpiresAt = addDays(new Date(), this.TOKEN_EXPIRY_DAYS);
    await this.prisma.$transaction([
      this.prisma.authToken.delete({ where: { token } }),
      this.prisma.authToken.create({
        data: { token: newTokenValue, userId: record.userId, expiresAt: newExpiresAt }
      }),
    ]);
    return { userId: record.userId, newToken: newTokenValue };
  }

  // Logout
  async logout(token: string) {
    await this.prisma.authToken.deleteMany({ where: { token } });
  }
}
