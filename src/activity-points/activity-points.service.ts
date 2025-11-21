import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityPointConfig } from './entities/activity-point-config.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ActivityPointsService {
  constructor(
    @InjectRepository(ActivityPointConfig)
    private configRepository: Repository<ActivityPointConfig>,
  ) {}

  async findAll(): Promise<ActivityPointConfig[]> {
    return this.configRepository.find({
      order: { activityName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ActivityPointConfig> {
    const config = await this.configRepository.findOne({ where: { id } });
    if (!config) {
      throw new NotFoundException(`Activity point config with ID ${id} not found`);
    }
    return config;
  }

  async findByType(activityType: string): Promise<ActivityPointConfig | null> {
    return this.configRepository.findOne({ 
      where: { activityType: activityType as 'donThuan' | 'huuHieu' | 'baptem' | 'thoPhuong' | 'lapCLB' | 'lenGiaiDoan' } 
    });
  }

  async create(createDto: any): Promise<ActivityPointConfig> {
    // Check if activity type already exists
    const existing = await this.configRepository.findOne({
      where: { activityType: createDto.activityType as 'donThuan' | 'huuHieu' | 'baptem' | 'thoPhuong' | 'lapCLB' | 'lenGiaiDoan' },
    });
    if (existing) {
      // Update instead of create
      existing.pointPerUnit = createDto.pointPerUnit;
      existing.activityName = createDto.activityName;
      existing.status = createDto.status || 'active';
      return await this.configRepository.save(existing);
    }

    const config = this.configRepository.create({
      id: uuidv4(),
      ...createDto,
    });
    const saved = await this.configRepository.save(config);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async update(id: string, updateDto: any): Promise<ActivityPointConfig> {
    const config = await this.findOne(id);
    Object.assign(config, updateDto);
    return this.configRepository.save(config);
  }

  async updateByType(activityType: string, updateDto: any): Promise<ActivityPointConfig> {
    const config = await this.findByType(activityType);
    if (!config) {
      throw new NotFoundException(`Activity point config for type ${activityType} not found`);
    }
    Object.assign(config, updateDto);
    return this.configRepository.save(config);
  }

  async remove(id: string): Promise<void> {
    const config = await this.findOne(id);
    await this.configRepository.remove(config);
  }

  // Initialize default point configs
  async initializeDefaults(): Promise<void> {
    const defaults = [
      { activityType: 'donThuan', activityName: 'Đơn thuần', pointPerUnit: 1 },
      { activityType: 'huuHieu', activityName: 'Hữu hiệu', pointPerUnit: 2 },
      { activityType: 'baptem', activityName: 'Baptem', pointPerUnit: 5 },
      { activityType: 'thoPhuong', activityName: 'Thờ phượng', pointPerUnit: 3 },
      { activityType: 'lapCLB', activityName: 'Lập CLB', pointPerUnit: 10 },
      { activityType: 'lenGiaiDoan', activityName: 'Lên giai đoạn', pointPerUnit: 15 },
    ];

    for (const defaultConfig of defaults) {
      const existing = await this.findByType(defaultConfig.activityType);
      if (!existing) {
        await this.create(defaultConfig);
      }
    }
  }
}

