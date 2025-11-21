// This is a compiled version for Vercel serverless functions
// Run: node dist/scripts/migrate-db.js

const { DataSource } = require('typeorm');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Note: This requires the compiled entities from dist/
// Make sure to build the project first: npm run build:backend

async function migrate() {
  const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  const usePostgres = isProduction || !!databaseUrl;

  // Import entities from compiled dist
  // Note: Adjust paths based on your build output
  const User = require('../users/entities/user.entity.js');
  const Team = require('../teams/entities/team.entity.js');
  const ActivityData = require('../activity-data/entities/activity-data.entity.js');

  const dataSource = new DataSource(
    usePostgres
      ? {
          type: 'postgres',
          url: databaseUrl,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          entities: [User, Team, ActivityData],
          synchronize: true,
          logging: true,
        }
      : {
          type: 'sqlite',
          database: 'iuba.db',
          entities: [User, Team, ActivityData],
          synchronize: true,
          logging: true,
        },
  );

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

migrate()
  .then(() => {
    console.log('✅ Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });

