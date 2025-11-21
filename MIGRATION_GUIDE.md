# 🔄 Database Migration Guide

Hướng dẫn sử dụng migration script để tạo database tables và admin user.

## 📋 Các Cách Chạy Migration

### Cách 1: Chạy Local (Development)

#### Bước 1: Cài đặt dependencies (nếu chưa có)
```bash
npm install
```

#### Bước 2: Set environment variables
Tạo file `.env.local` hoặc export variables:

```bash
# For SQLite (local dev)
export NODE_ENV=development

# For PostgreSQL (production-like)
export NODE_ENV=development
export POSTGRES_URL=postgresql://user:password@host:port/database
# hoặc
export DATABASE_URL=postgresql://user:password@host:port/database
```

#### Bước 3: Chạy migration
```bash
npm run migrate
```

### Cách 2: Chạy trên Vercel (Production)

#### Option A: Dùng API Endpoint (Khuyên dùng)

1. **Set Environment Variable trên Vercel:**
   ```
   MIGRATION_SECRET=your-secret-key-here
   ```

2. **Call API endpoint:**
   ```bash
   curl -X POST https://your-domain.vercel.app/api/migrate \
     -H "Content-Type: application/json" \
     -H "X-Migration-Secret: your-secret-key-here" \
     -d '{"secret":"your-secret-key-here"}'
   ```

   Hoặc dùng browser/Postman:
   - URL: `https://your-domain.vercel.app/api/migrate`
   - Method: POST
   - Headers:
     - `Content-Type: application/json`
     - `X-Migration-Secret: your-secret-key-here`
   - Body:
     ```json
     {
       "secret": "your-secret-key-here"
     }
     ```

#### Option B: Chạy Script trên Vercel CLI

1. **Build project:**
   ```bash
   npm run build:backend
   ```

2. **Set environment variables:**
   ```bash
   export POSTGRES_URL=your-postgres-url
   export DATABASE_URL=your-postgres-url
   export NODE_ENV=production
   ```

3. **Chạy migration:**
   ```bash
   npm run migrate:prod
   ```

   Hoặc trực tiếp:
   ```bash
   node dist/scripts/migrate-db.js
   ```

### Cách 3: Chạy từ Local với Production Database

1. **Set environment variables:**
   ```bash
   export POSTGRES_URL=your-vercel-postgres-url
   export DATABASE_URL=your-vercel-postgres-url
   export NODE_ENV=production
   ```

2. **Build và chạy:**
   ```bash
   npm run build:backend
   npm run migrate:prod
   ```

## 🔐 Security

### API Endpoint Security

Migration endpoint (`/api/migrate`) được bảo vệ bằng secret key:

1. **Set `MIGRATION_SECRET` trên Vercel:**
   ```
   MIGRATION_SECRET=your-very-secure-secret-key
   ```

2. **Gửi secret trong request:**
   - Header: `X-Migration-Secret: your-very-secure-secret-key`
   - Hoặc Body: `{"secret": "your-very-secure-secret-key"}`

3. **Sau khi migration xong, có thể xóa endpoint hoặc disable**

## ✅ Verification

Sau khi chạy migration:

1. **Check logs:**
   - Local: Xem console output
   - Vercel: Dashboard → Functions → View logs

2. **Test API:**
   ```bash
   curl https://your-domain.vercel.app/api/health
   ```

3. **Test Login:**
   ```bash
   curl -X POST https://your-domain.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

## 📝 Migration Script Details

### Script Location
- **TypeScript:** `src/scripts/migrate-db.ts`
- **Compiled:** `dist/scripts/migrate-db.js`
- **API Endpoint:** `api/migrate.ts`

### What It Does

1. **Connects to database** (PostgreSQL hoặc SQLite)
2. **Creates/updates tables:**
   - `users`
   - `teams`
   - `activity_data`
3. **Creates default admin user:**
   - Username: `admin`
   - Password: `admin123`
   - Role: `admin`

### Tables Created

#### Users Table
- id (UUID, Primary Key)
- username (Unique)
- password (Hashed)
- fullName
- email
- phone
- role (admin/user)
- teamId (Foreign Key)
- status (active/inactive)
- createdAt, updatedAt

#### Teams Table
- id (UUID, Primary Key)
- teamCode (Unique)
- teamName
- description
- status (active/inactive)
- createdAt, updatedAt

#### Activity Data Table
- id (UUID, Primary Key)
- userId (Foreign Key)
- teamId (Foreign Key)
- date
- donThuan, huuHieu, baptem, thoPhuong, lapCLB, lenGiaiDoan
- createdAt, updatedAt

## 🚨 Troubleshooting

### Error: "relation does not exist"
- Migration chưa được chạy
- Kiểm tra database connection
- Chạy lại migration

### Error: "Connection refused"
- Kiểm tra `POSTGRES_URL` hoặc `DATABASE_URL`
- Kiểm tra database có đang chạy không
- Kiểm tra firewall/network settings

### Error: "Unauthorized" (API endpoint)
- Kiểm tra `MIGRATION_SECRET` đã được set
- Kiểm tra secret key trong request header/body

### Error: "Module not found"
- Build project trước: `npm run build:backend`
- Kiểm tra entities có được compile đúng không

## 📚 Related Files

- `src/scripts/migrate-db.ts` - Migration script
- `api/migrate.ts` - API endpoint for migration
- `src/app.module.ts` - Database configuration
- `FIX_DATABASE_TABLES.md` - Alternative solutions

## 🎯 Quick Start

**Cách nhanh nhất cho Vercel:**

1. Set `MIGRATION_SECRET` trong Vercel Dashboard
2. Deploy code
3. Call API:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/migrate \
     -H "X-Migration-Secret: your-secret" \
     -H "Content-Type: application/json" \
     -d '{"secret":"your-secret"}'
   ```
4. Done! ✅

