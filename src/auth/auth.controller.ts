import { Controller, Post, Body, Req, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Post('login')
  async login(@Body() body) {
    const { email , password } = body;
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }
    const token = await this.authService.login(user.id);
    return { token };
  }

  @Post('signup')
  async signup(@Body() body) {
    const { email , firstName , lastName , password } = body;
    const user = await this.userService.findOne(email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userService.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });
    const token = await this.authService.login(newUser.id);
    return { token };
  }

  @Post('logout')
  async logout(@Req() req) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new BadRequestException('No token provided');
    }
    await this.authService.logout(token);
    return { success: true };
  }
}
