import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ClerkService } from '../clerk/clerk.service';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private clerkService: ClerkService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.replace('Bearer ', '');

      if (!token) throw new UnauthorizedException('Token required');

      try {
        const user = await this.clerkService.verifyToken(token);
        request.user = user;
        return true;
      } catch (error) {
        console.error('Authentication error:', error);
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }