# 🚀 Auto Migration Guide

Hướng dẫn sử dụng script tự động để deploy và chạy migration.

## ⚡ Cách Nhanh Nhất

### Option 1: Dùng AUTO_MIGRATE (Khuyên dùng cho lần đầu)

#### Bước 1: Set Environment Variable trên Vercel

Vào **Vercel Dashboard → Settings → Environment Variables**, thêm:

```
AUTO_MIGRATE=true
```

#### Bước 2: Chạy Script Tự Động

```bash
./auto-migrate.sh
```

Script sẽ:
1. ✅ Deploy lên Vercel production
2. ✅ Chờ deployment sẵn sàng
3. ✅ Tự động chạy migration (không cần secret key)
4. ✅ Test login
5. ✅ Hiển thị thông tin đăng nhập

### Option 2: Dùng MIGRATION_SECRET

#### Bước 1: Set Environment Variable trên Vercel

```
MIGRATION_SECRET=your-secret-key-here
```

Tạo secret key:
```bash
openssl rand -base64 32
```

#### Bước 2: Chạy Script

```bash
./auto-migrate.sh your-secret-key-here
```

Hoặc set environment variable:
```bash
export MIGRATION_SECRET=your-secret-key-here
./auto-migrate.sh
```

## 📋 Scripts Available

### 1. `auto-migrate.sh` - Deploy + Migration Tự Động

**Chức năng:**
- Deploy lên Vercel production
- Chờ deployment sẵn sàng
- Tự động chạy migration
- Test login
- Hiển thị kết quả

**Usage:**
```bash
./auto-migrate.sh [MIGRATION_SECRET]
```

**Ví dụ:**
```bash
# Với AUTO_MIGRATE mode
./auto-migrate.sh

# Với secret key
./auto-migrate.sh my-secret-key-123
```

### 2. `run-auto-migrate.sh` - Chỉ Chạy Migration

**Chức năng:**
- Chỉ chạy migration (không deploy)
- Cần deployment URL
- Test login sau migration

**Usage:**
```bash
./run-auto-migrate.sh [DEPLOY_URL] [MIGRATION_SECRET]
```

**Ví dụ:**
```bash
# Tự động lấy URL từ Vercel
./run-auto-migrate.sh

# Với URL cụ thể
./run-auto-migrate.sh https://iuba-system.vercel.app

# Với URL và secret
./run-auto-migrate.sh https://iuba-system.vercel.app my-secret-key
```

## 🔧 Setup

### 1. Make Scripts Executable

```bash
chmod +x auto-migrate.sh
chmod +x run-auto-migrate.sh
```

### 2. Install Dependencies (nếu cần)

```bash
npm install
```

### 3. Vercel CLI (nếu chưa có)

```bash
npm install -g vercel
vercel login
```

## 🎯 Workflow

### Lần Đầu Setup (Recommended)

1. **Set Environment Variables trên Vercel:**
   ```
   AUTO_MIGRATE=true
   POSTGRES_URL=your-postgres-url
   DATABASE_URL=your-postgres-url
   JWT_SECRET=your-jwt-secret
   NODE_ENV=production
   ```

2. **Chạy script:**
   ```bash
   ./auto-migrate.sh
   ```

3. **Done!** ✅
   - Database tables đã được tạo
   - Admin user đã được tạo
   - Có thể login ngay

### Sau Khi Setup Xong

1. **Tắt AUTO_MIGRATE (optional):**
   - Set `AUTO_MIGRATE=false` hoặc xóa variable
   - Hoặc set `MIGRATION_SECRET` để bảo mật hơn

2. **Deploy bình thường:**
   ```bash
   vercel --prod
   ```

3. **Chạy migration khi cần:**
   ```bash
   ./run-auto-migrate.sh
   ```

## 🔒 Security

### AUTO_MIGRATE Mode

- ✅ Dễ dàng cho lần đầu setup
- ⚠️ Không cần authentication
- ⚠️ Nên tắt sau khi setup xong

### MIGRATION_SECRET Mode

- ✅ Bảo mật hơn
- ✅ Cần secret key để chạy migration
- ✅ Khuyên dùng cho production

## 📝 Output Example

```
🚀 Auto Deploy & Migrate IUBA System

✅ Vercel CLI: 48.10.6
✅ Đã đăng nhập: ducdo777

📦 Đang deploy lên Vercel...
✅ Deploy thành công!
📍 URL: https://iuba-system.vercel.app

⏳ Đang chờ deployment sẵn sàng...
✅ Deployment đã sẵn sàng!

🔄 Đang chạy migration...
Response Code: 200
Response Body:
{
  "success": true,
  "message": "Database migration completed successfully",
  "adminUser": {
    "username": "admin",
    "password": "admin123"
  }
}

✅ Migration thành công!

📋 Thông tin đăng nhập:
   Username: admin
   Password: admin123

🧪 Đang test login...
✅ Login test thành công!

🎉 Hoàn thành!
📍 Production URL: https://iuba-system.vercel.app
🔐 Admin Login: admin / admin123
```

## 🆘 Troubleshooting

### Error: "Deployment chưa sẵn sàng"
- Đợi thêm vài phút
- Kiểm tra Vercel Dashboard xem deployment có thành công không

### Error: "Unauthorized"
- Kiểm tra `MIGRATION_SECRET` đã được set đúng chưa
- Hoặc set `AUTO_MIGRATE=true` để dùng auto mode

### Error: "Database URL not configured"
- Kiểm tra `POSTGRES_URL` hoặc `DATABASE_URL` đã được set chưa

### Error: "Connection failed"
- Kiểm tra database connection string
- Kiểm tra database có accessible không

## 📚 Related Files

- `auto-migrate.sh` - Main auto migration script
- `run-auto-migrate.sh` - Migration only script
- `MIGRATION_GUIDE.md` - Detailed migration guide
- `MIGRATION_QUICK_START.md` - Quick start guide

