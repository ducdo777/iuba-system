import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { ActivityDataModule } from './activity-data/activity-data.module';
import { StatisticsModule } from './statistics/statistics.module';
import { User } from './users/entities/user.entity';
import { Team } from './teams/entities/team.entity';
import { ActivityData } from './activity-data/entities/activity-data.entity';
import * as bcrypt from 'bcryptjs';

// Determine database type based on environment
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const usePostgres = isProduction || !!databaseUrl;
// Enable synchronize for initial setup or if INIT_DB is set
const shouldSync = !isProduction || process.env.INIT_DB === 'true' || process.env.ENABLE_SYNC === 'true';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      usePostgres
        ? {
            type: 'postgres',
            url: databaseUrl,
            ssl: isProduction ? { rejectUnauthorized: false } : false,
            entities: [User, Team, ActivityData],
            synchronize: shouldSync, // Enable for initial setup
            logging: process.env.NODE_ENV === 'development',
            extra: {
              connectionLimit: 5,
              max: 5,
              idleTimeoutMillis: 30000,
              connectionTimeoutMillis: 10000,
            },
          }
        : {
            type: 'sqlite',
            database: 'iuba.db',
            entities: [User, Team, ActivityData],
            synchronize: true,
            logging: false,
          },
    ),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    TeamsModule,
    ActivityDataModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    // Wait a bit for database connection to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create default admin user if not exists
    try {
      const admin = await this.userRepository.findOne({ where: { username: 'admin' } });
      if (!admin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const newAdmin = this.userRepository.create({
          username: 'admin',
          password: hashedPassword,
          fullName: 'Administrator',
          role: 'admin',
          status: 'active',
        });
        await this.userRepository.save(newAdmin);
        console.log('Default admin user created: admin/admin123');
      } else {
        console.log('Admin user already exists');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
      // If tables don't exist, log a helpful message
      if (error.message && error.message.includes('does not exist')) {
        console.error('Database tables not found. Please set INIT_DB=true or ENABLE_SYNC=true to create tables.');
      }
    }
  }
}