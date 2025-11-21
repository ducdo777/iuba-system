import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ActivityPointsService } from './activity-points.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/activity-points')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ActivityPointsController {
  constructor(private readonly activityPointsService: ActivityPointsService) {}

  @Get()
  findAll() {
    return this.activityPointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityPointsService.findOne(id);
  }

  @Post()
  create(@Body() createDto: any) {
    return this.activityPointsService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.activityPointsService.update(id, updateDto);
  }

  @Put('type/:type')
  updateByType(@Param('type') type: string, @Body() updateDto: any) {
    return this.activityPointsService.updateByType(type, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityPointsService.remove(id);
  }

  @Post('initialize')
  initialize() {
    return this.activityPointsService.initializeDefaults();
  }
}

