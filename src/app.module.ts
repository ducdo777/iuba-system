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
import { ActivityPointsModule } from './activity-points/activity-points.module';
import { User } from './users/entities/user.entity';
import { Team } from './teams/entities/team.entity';
import { ActivityData } from './activity-data/entities/activity-data.entity';
import { ActivityPointConfig } from './activity-points/entities/activity-point-config.entity';
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
            entities: [User, Team, ActivityData, ActivityPointConfig],
            synchronize: shouldSync, // Enable for initial setup
            logging: process.env.NODE_ENV === 'development',
            extra: {
              connectionLimit: 10,
              max: 10,
              idleTimeoutMillis: 20000,
              connectionTimeoutMillis: 5000,
              // Enable connection pooling for better performance
              poolSize: 10,
            },
          }
        : {
            type: 'sqlite',
            database: 'iuba.db',
            entities: [User, Team, ActivityData, ActivityPointConfig],
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
    ActivityPointsModule,
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
    // Don't wait - let it run asynchronously to avoid blocking startup
    // This improves cold start time on Vercel
    this.initializeAdminUser().catch(error => {
      console.error('Error initializing admin user:', error);
    });
  }

  private async initializeAdminUser() {
    try {
      // Small delay only if needed for database connection
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const admin = await this.userRepository.findOne({ where: { username: 'admin' } });
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      if (!admin) {
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
        admin.password = hashedPassword;
        admin.fullName = admin.fullName || 'Administrator';
        admin.role = 'admin';
        admin.status = 'active';
        await this.userRepository.save(admin);
        console.log('Admin user password reset: admin/admin123');
      }
    } catch (error) {
      console.error('Error creating/updating admin user:', error);
      if (error.message && error.message.includes('does not exist')) {
        console.error('Database tables not found. Please set INIT_DB=true or ENABLE_SYNC=true to create tables.');
      }
    }
  }
}