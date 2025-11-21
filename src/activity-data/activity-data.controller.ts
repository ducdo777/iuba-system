import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ActivityDataService } from './activity-data.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/activity-data')
@UseGuards(JwtAuthGuard)
export class ActivityDataController {
  constructor(private readonly activityDataService: ActivityDataService) {}

  @Get()
  findAll(
    @Query('teamId') teamId?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Request() req?: any,
  ) {
    // If user, only show their team's data
    const user = req?.user;
    if (user?.role === 'user' && !teamId) {
      teamId = user.user?.teamId;
    }
    return this.activityDataService.findAll(teamId, userId, startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityDataService.findOne(id);
  }

  @Post()
  create(@Body() createDto: any, @Request() req: any) {
    const user = req.user;
    // Auto-assign teamId if user role
    if (user.role === 'user' && !createDto.teamId) {
      createDto.teamId = user.user?.teamId;
    }
    if (!createDto.userId) {
      createDto.userId = user.userId;
    }
    return this.activityDataService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any, @Request() req: any) {
    const user = req.user;
    // Only allow users to update their own data
    if (user.role === 'user') {
      return this.activityDataService.updateByUser(id, updateDto, user.userId);
    }
    return this.activityDataService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const user = req.user;
    if (user.role === 'user') {
      return this.activityDataService.removeByUser(id, user.userId);
    }
    return this.activityDataService.remove(id);
  }
}

