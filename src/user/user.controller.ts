import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { TokenAuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(TokenAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getMe(@Req() req) {
    const user = await this.userService.findUser(req.user.id);
    return user;
  }
}
