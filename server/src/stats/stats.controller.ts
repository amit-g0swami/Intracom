import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatsService } from './stats.service';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('status')
  getStatus() {
    return this.statsService.getStatus();
  }

  @Get('dashboard')
  getDashboard() {
    return this.statsService.getDashboard();
  }
}
