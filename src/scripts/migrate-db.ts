import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Team } from '../teams/entities/team.entity';
import { ActivityData } from '../activity-data/entities/activity-data.entity';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Determine database type based on environment
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const usePostgres = isProduction || !!databaseUrl;

const dataSource = new DataSource(
  usePostgres
    ? {
        type: 'postgres',
        url: databaseUrl,
        ssl: isProduction ? { rejectUnauthorized: false } : false,
        entities: [User, Team, ActivityData],
        synchronize: true, // Enable for migration
        logging: true,
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
        logging: true,
      },
);

async function migrate() {
  try {
    console.log('🔄 Initializing database connection...');
    await dataSource.initialize();
    console.log('✅ Database connected');

    // Synchronize will create tables if they don't exist
    console.log('🔄 Creating/updating database tables...');
    await dataSource.synchronize();
    console.log('✅ Database tables created/updated');

    // Create default admin user
    console.log('🔄 Creating default admin user...');
    const userRepository = dataSource.getRepository(User);
    
    const existingAdmin = await userRepository.findOne({ where: { username: 'admin' } });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = userRepository.create({
        id: uuidv4(),
        username: 'admin',
        password: hashedPassword,
        fullName: 'Administrator',
        role: 'admin',
        status: 'active',
      });
      await userRepository.save(admin);
      console.log('✅ Default admin user created');
      console.log('   Username: admin');
      console.log('   Password: admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run migration
migrate()
  .then(() => {
    console.log('✅ Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });

