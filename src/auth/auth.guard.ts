import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No token provided');
      throw new UnauthorizedException();
    }
    const token = authHeader.slice(7);
    try {
      const { userId, newToken } = await this.authService.validateAndRefresh(token);
      req.user = { id: userId };
      // Optionally set new token in response header
      context.switchToHttp().getResponse().setHeader('x-auth-token', newToken);
      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
