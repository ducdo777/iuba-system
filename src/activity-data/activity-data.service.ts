import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ActivityData } from './entities/activity-data.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ActivityDataService {
  constructor(
    @InjectRepository(ActivityData)
    private activityDataRepository: Repository<ActivityData>,
  ) {}

  async findAll(
    teamId?: string,
    userId?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<ActivityData[]> {
    const where: any = {};
    if (teamId) where.teamId = teamId;
    if (userId) where.userId = userId;
    if (startDate && endDate) {
      where.date = Between(startDate, endDate);
    } else if (startDate) {
      where.date = startDate;
    }

    return this.activityDataRepository.find({
      where,
      relations: ['team', 'user'],
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ActivityData> {
    const data = await this.activityDataRepository.findOne({
      where: { id },
      relations: ['team', 'user'],
    });
    if (!data) {
      throw new NotFoundException(`Activity data with ID ${id} not found`);
    }
    return data;
  }

  async create(createDto: any): Promise<ActivityData> {
    const data = this.activityDataRepository.create({
      id: uuidv4(), // Generate UUID manually for PostgreSQL
      ...createDto,
    });
    const saved = await this.activityDataRepository.save(data);
    return saved as unknown as ActivityData;
  }

  async update(id: string, updateDto: any): Promise<ActivityData> {
    const data = await this.findOne(id);
    Object.assign(data, updateDto);
    return this.activityDataRepository.save(data);
  }

  async updateByUser(id: string, updateDto: any, userId: string): Promise<ActivityData> {
    const data = await this.findOne(id);
    if (data.userId !== userId) {
      throw new ForbiddenException('You can only update your own data');
    }
    Object.assign(data, updateDto);
    return this.activityDataRepository.save(data);
  }

  async remove(id: string): Promise<void> {
    const data = await this.findOne(id);
    await this.activityDataRepository.remove(data);
  }

  async removeByUser(id: string, userId: string): Promise<void> {
    const data = await this.findOne(id);
    if (data.userId !== userId) {
      throw new ForbiddenException('You can only delete your own data');
    }
    await this.activityDataRepository.remove(data);
  }
}
