import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

async function createAdmin() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'iuba.db',
    entities: [User],
    synchronize: true,
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  // Check if admin exists
  const existingAdmin = await userRepository.findOne({ where: { username: 'admin' } });

  if (!existingAdmin) {
    // Chỉ tạo admin mới nếu chưa tồn tại với password mặc định
    const hashedPassword = await bcrypt.hash('animo2025@', 10);
    const admin = userRepository.create({
      username: 'admin',
      password: hashedPassword,
      fullName: 'Administrator',
      role: 'admin',
      status: 'active',
    });
    await userRepository.save(admin);
    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: animo2025@');
  } else {
    console.log('Admin user already exists - password preserved');
  }

  await dataSource.destroy();
}

createAdmin().catch(console.error);

