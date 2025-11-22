import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Team } from '../teams/entities/team.entity';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  async findAll(teamId?: string, role?: string): Promise<User[]> {
    const where: any = {};
    if (teamId) where.teamId = teamId;
    if (role) where.role = role;
    return this.usersRepository.find({
      where,
      relations: ['team'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['team'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['team'],
    });
  }

  async create(createUserDto: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password || '123456', 10);
    const user = this.usersRepository.create({
      id: uuidv4(), // Generate UUID manually for PostgreSQL
      ...createUserDto,
      password: hashedPassword,
    });
    const saved = await this.usersRepository.save(user);
    const savedUser = Array.isArray(saved) ? saved[0] : saved;
    
    // Update team totalMembers if teamId is provided
    if (savedUser && savedUser.teamId) {
      await this.updateTeamMemberCount(savedUser.teamId);
    }
    
    return savedUser as User;
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    const user = await this.findOne(id);
    const oldTeamId = user.teamId;
    
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    Object.assign(user, updateUserDto);
    const saved = await this.usersRepository.save(user);
    const savedUser = Array.isArray(saved) ? saved[0] : saved;
    
    // Update team member counts if team changed
    if (oldTeamId !== savedUser.teamId) {
      if (oldTeamId) {
        await this.updateTeamMemberCount(oldTeamId);
      }
      if (savedUser.teamId) {
        await this.updateTeamMemberCount(savedUser.teamId);
      }
    }
    
    return savedUser as User;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    const teamId = user.teamId;
    await this.usersRepository.remove(user);
    
    // Update team totalMembers if user had a team
    if (teamId) {
      await this.updateTeamMemberCount(teamId);
    }
  }

  private async updateTeamMemberCount(teamId: string): Promise<void> {
    const memberCount = await this.usersRepository.count({
      where: { teamId, status: 'active' },
    });
    
    await this.teamsRepository.update(teamId, {
      totalMembers: memberCount,
    });
  }
}
