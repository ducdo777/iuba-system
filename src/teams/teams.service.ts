import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  async findAll(): Promise<Team[]> {
    return this.teamsRepository.find({
      order: { teamName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async create(createTeamDto: any): Promise<Team> {
    const team = this.teamsRepository.create({
      id: uuidv4(), // Generate UUID manually for PostgreSQL
      totalMembers: 0, // Initialize with 0, will be updated when users are added
      ...createTeamDto,
    });
    const saved = await this.teamsRepository.save(team);
    return saved as unknown as Team;
  }

  async update(id: string, updateTeamDto: any): Promise<Team> {
    const team = await this.findOne(id);
    Object.assign(team, updateTeamDto);
    return this.teamsRepository.save(team);
  }

  async remove(id: string): Promise<void> {
    const team = await this.findOne(id);
    await this.teamsRepository.remove(team);
  }
}
