import { VercelRequest, VercelResponse } from '@vercel/node';
import { DataSource } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

// Endpoint to reset admin password
// Usage: POST /api/reset-admin (with secret key)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secretKey = process.env.MIGRATION_SECRET || process.env.RESET_ADMIN_SECRET || 'reset-admin-secret';
  const providedKey = req.headers['x-reset-secret'] || req.body?.secret;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (providedKey !== secretKey) {
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
    entities: [User],
    synchronize: false,
    logging: false,
    extra: {
      connectionLimit: 5,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    },
  });

  try {
    await dataSource.initialize();
    const userRepository = dataSource.getRepository(User);
    
    const admin = await userRepository.findOne({ where: { username: 'admin' } });
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    // Reset password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    admin.password = hashedPassword;
    admin.fullName = admin.fullName || 'Administrator';
    admin.role = 'admin';
    admin.status = 'active';
    await userRepository.save(admin);

    await dataSource.destroy();

    return res.status(200).json({
      success: true,
      message: 'Admin password reset successfully',
      adminUser: {
        username: 'admin',
        password: 'admin123',
      },
    });
  } catch (error: any) {
    console.error('❌ Reset admin failed:', error);
    
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Reset failed',
    });
  }
}

