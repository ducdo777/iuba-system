import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/statistics')
@UseGuards(JwtAuthGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('overview')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.statisticsService.getOverview(startDate, endDate);
  }

  @Get('by-team')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getByTeam(
    @Query('teamId') teamId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.statisticsService.getByTeam(teamId, startDate, endDate);
  }

  @Get('my-team')
  getMyTeamStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Request() req?: any,
  ) {
    const teamId = req.user?.user?.teamId;
    return this.statisticsService.getByTeam(teamId, startDate, endDate);
  }
}

