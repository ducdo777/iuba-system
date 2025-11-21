import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityPointsController } from './activity-points.controller';
import { ActivityPointsService } from './activity-points.service';
import { ActivityPointConfig } from './entities/activity-point-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityPointConfig])],
  controllers: [ActivityPointsController],
  providers: [ActivityPointsService],
  exports: [ActivityPointsService],
})
export class ActivityPointsModule {}

