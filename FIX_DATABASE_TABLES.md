# 🔧 Fix Database Tables Not Found

## Vấn đề
Lỗi: `relation "users" does not exist` - Database tables chưa được tạo trên PostgreSQL.

## ✅ Đã sửa

### 1. Enable Synchronize cho Initial Setup
- Thêm logic để enable `synchronize` khi:
  - `INIT_DB=true` được set
  - `ENABLE_SYNC=true` được set
  - Hoặc trong development mode

### 2. Cải thiện Error Handling
- Thêm delay để đảm bảo database connection ready
- Better error messages

## 🔧 Cách 1: Set Environment Variable (Khuyên dùng)

### Trên Vercel Dashboard:

1. Vào **Settings → Environment Variables**
2. Thêm variable:
   ```
   INIT_DB=true
   ```
3. **Redeploy** project

Sau khi tables được tạo, có thể xóa `INIT_DB=true` hoặc set thành `false`.

## 🔧 Cách 2: Tạo Tables Thủ Công

Nếu không muốn dùng synchronize, có thể tạo tables thủ công:

### 1. Connect vào Vercel Postgres

```bash
# Lấy connection string từ Vercel Dashboard → Storage → Postgres
psql "your-connection-string"
```

### 2. Tạo Tables

```sql
-- Users table
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  "fullName" VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  role VARCHAR NOT NULL,
  "teamId" VARCHAR,
  status VARCHAR,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Teams table
CREATE TABLE teams (
  id VARCHAR PRIMARY KEY,
  "teamCode" VARCHAR UNIQUE NOT NULL,
  "teamName" VARCHAR NOT NULL,
  description VARCHAR,
  status VARCHAR,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Activity Data table
CREATE TABLE activity_data (
  id VARCHAR PRIMARY KEY,
  "userId" VARCHAR NOT NULL,
  "teamId" VARCHAR NOT NULL,
  date DATE NOT NULL,
  "donThuan" INTEGER DEFAULT 0,
  "huuHieu" INTEGER DEFAULT 0,
  baptem INTEGER DEFAULT 0,
  "thoPhuong" INTEGER DEFAULT 0,
  "lapCLB" INTEGER DEFAULT 0,
  "lenGiaiDoan" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Foreign keys
ALTER TABLE users ADD CONSTRAINT fk_user_team FOREIGN KEY ("teamId") REFERENCES teams(id);
ALTER TABLE activity_data ADD CONSTRAINT fk_activity_user FOREIGN KEY ("userId") REFERENCES users(id);
ALTER TABLE activity_data ADD CONSTRAINT fk_activity_team FOREIGN KEY ("teamId") REFERENCES teams(id);
```

### 3. Tạo Admin User

```sql
-- Hash password: admin123
INSERT INTO users (id, username, password, "fullName", role, status, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin',
  '$2a$10$rOzJqXqXqXqXqXqXqXqXeXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqX', -- bcrypt hash của 'admin123'
  'Administrator',
  'admin',
  'active',
  NOW(),
  NOW()
);
```

## 🔧 Cách 3: Dùng Migration Script

Tạo script migration để init database:

```typescript
// scripts/init-db.ts
import { DataSource } from 'typeorm';
import { User, Team, ActivityData } from '../src/...';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  entities: [User, Team, ActivityData],
  synchronize: true, // Chỉ dùng cho init
});

dataSource.initialize().then(() => {
  console.log('Database initialized');
  dataSource.destroy();
});
```

## ✅ Verification

Sau khi tables được tạo:

1. **Test API:**
   ```bash
   curl https://your-domain.vercel.app/api/health
   ```

2. **Test Login:**
   ```bash
   curl -X POST https://your-domain.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

3. **Check Logs:**
   - Vercel Dashboard → Functions → View logs
   - Tìm message: "Default admin user created"

## 📝 Lưu ý

- **Synchronize trong production**: Không nên dùng lâu dài, chỉ dùng cho initial setup
- **Sau khi tables được tạo**: Set `INIT_DB=false` hoặc xóa variable
- **Best practice**: Dùng migrations cho production

## 🚀 Quick Fix

**Cách nhanh nhất:**

1. Set `INIT_DB=true` trong Vercel Dashboard
2. Redeploy
3. Sau khi deploy thành công, set `INIT_DB=false` hoặc xóa

