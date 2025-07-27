import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    const user = await this.userService.findOrCreateUser(req.user.sub);
    console.log("user", user);
    return user;
  }
}
