import { VercelRequest, VercelResponse } from '@vercel/node';
import { DataSource } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { Team } from '../src/teams/entities/team.entity';
import { ActivityData } from '../src/activity-data/entities/activity-data.entity';
import { ActivityPointConfig } from '../src/activity-points/entities/activity-point-config.entity';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// This endpoint can be called to initialize the database
// Usage: POST /api/migrate (with secret key in header)
// Or set AUTO_MIGRATE=true to run automatically on first request

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Security: Only allow POST and check for secret key
  const secretKey = process.env.MIGRATION_SECRET || 'migration-secret-key';
  const providedKey = req.headers['x-migration-secret'] || req.body?.secret;
  const autoMigrate = process.env.AUTO_MIGRATE === 'true';

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Allow auto-migrate if enabled (for first-time setup)
  if (!autoMigrate && providedKey !== secretKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database URL not configured' });
  }

  const dataSource = new DataSource({
    type: 'postgres',
    url: databaseUrl,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    entities: [User, Team, ActivityData, ActivityPointConfig],
    synchronize: true,
    logging: false,
    extra: {
      connectionLimit: 5,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    },
  });

  try {
    console.log('🔄 Initializing database connection...');
    await dataSource.initialize();
    console.log('✅ Database connected');

    console.log('🔄 Creating/updating database tables...');
    await dataSource.synchronize();
    console.log('✅ Database tables created/updated');

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
    } else {
      // Reset password to ensure it's correct
      const hashedPassword = await bcrypt.hash('admin123', 10);
      existingAdmin.password = hashedPassword;
      existingAdmin.fullName = existingAdmin.fullName || 'Administrator';
      existingAdmin.role = 'admin';
      existingAdmin.status = 'active';
      await userRepository.save(existingAdmin);
      console.log('✅ Admin user password reset');
    }

    // Initialize default activity point configs
    const pointConfigRepository = dataSource.getRepository(ActivityPointConfig);
    const defaultConfigs = [
      { activityType: 'donThuan', activityName: 'Đơn thuần', pointPerUnit: 1 },
      { activityType: 'huuHieu', activityName: 'Hữu hiệu', pointPerUnit: 2 },
      { activityType: 'baptem', activityName: 'Baptem', pointPerUnit: 5 },
      { activityType: 'thoPhuong', activityName: 'Thờ phượng', pointPerUnit: 3 },
      { activityType: 'lapCLB', activityName: 'Lập CLB', pointPerUnit: 10 },
      { activityType: 'lenGiaiDoan', activityName: 'Lên giai đoạn', pointPerUnit: 15 },
    ];

    for (const config of defaultConfigs) {
      const existing = await pointConfigRepository.findOne({
        where: { activityType: config.activityType as any },
      });
      if (!existing) {
        const newConfig = pointConfigRepository.create({
          id: uuidv4(),
          ...config,
          status: 'active',
        });
        await pointConfigRepository.save(newConfig);
        console.log(`✅ Created point config for ${config.activityName}`);
      }
    }

    await dataSource.destroy();

    return res.status(200).json({
      success: true,
      message: 'Database migration completed successfully',
      adminUser: {
        username: 'admin',
        password: 'admin123',
      },
    });
  } catch (error: any) {
    console.error('❌ Migration failed:', error);
    
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Migration failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

