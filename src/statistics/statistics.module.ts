import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { ActivityDataModule } from '../activity-data/activity-data.module';
import { TeamsModule } from '../teams/teams.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ActivityDataModule, TeamsModule, UsersModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
