// src/clerk/clerk.service.ts
import { Injectable } from '@nestjs/common';
import { verifyToken } from '@clerk/backend';

@Injectable()
export class ClerkService {
  async verifyToken(token: string) {
    if (!process.env.CLERK_SECRET_KEY) {
      throw new Error('CLERK_SECRET_KEY is not set');
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      issuer: process.env.CLERK_ISSUER || 'https://clerk.dev',
    });

    return payload;
  }
}
