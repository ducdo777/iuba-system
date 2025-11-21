import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityDataController } from './activity-data.controller';
import { ActivityDataService } from './activity-data.service';
import { ActivityData } from './entities/activity-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityData])],
  controllers: [ActivityDataController],
  providers: [ActivityDataService],
  exports: [ActivityDataService],
})
export class ActivityDataModule {}
