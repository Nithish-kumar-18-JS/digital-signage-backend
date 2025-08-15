// upload.controller.ts
import {
    Controller,
    Get,
    Req,
    UseGuards,
  } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { TokenAuthGuard } from '../auth/auth.guard';

  
  @Controller('dashboard')
  @UseGuards(TokenAuthGuard)
  export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}
  
    @Get()
    async getDashboard(@Req() req: any) {
      const userId = req.user.id;
      return this.dashboardService.getDashboard(userId);
    }
  }
  