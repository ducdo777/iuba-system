# 🚀 Migration Quick Start

Hướng dẫn nhanh để chạy migration trên Vercel.

## ⚡ Cách Nhanh Nhất (API Endpoint)

### Bước 1: Set Environment Variable

Vào **Vercel Dashboard → Settings → Environment Variables**, thêm:

```
MIGRATION_SECRET=your-secret-key-here
```

**Lưu ý:** Tạo secret key mạnh, ví dụ:
```bash
openssl rand -base64 32
```

### Bước 2: Deploy Code

Code đã được push, Vercel sẽ tự động deploy. Hoặc deploy thủ công:

```bash
vercel --prod
```

### Bước 3: Chạy Migration

Sau khi deploy xong, gọi API endpoint:

```bash
curl -X POST https://your-domain.vercel.app/api/migrate \
  -H "Content-Type: application/json" \
  -H "X-Migration-Secret: your-secret-key-here" \
  -d '{"secret":"your-secret-key-here"}'
```

**Hoặc dùng browser/Postman:**

1. URL: `https://your-domain.vercel.app/api/migrate`
2. Method: `POST`
3. Headers:
   - `Content-Type: application/json`
   - `X-Migration-Secret: your-secret-key-here`
4. Body (JSON):
   ```json
   {
     "secret": "your-secret-key-here"
   }
   ```

### Bước 4: Kiểm Tra

Response thành công sẽ có dạng:
```json
{
  "success": true,
  "message": "Database migration completed successfully",
  "adminUser": {
    "username": "admin",
    "password": "admin123"
  }
}
```

### Bước 5: Test Login

```bash
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## ✅ Done!

Sau khi migration thành công:
- ✅ Database tables đã được tạo
- ✅ Admin user đã được tạo (admin/admin123)
- ✅ Có thể login vào hệ thống

## 🔒 Security Note

Sau khi migration xong, bạn có thể:
- Xóa `MIGRATION_SECRET` environment variable
- Hoặc giữ lại để chạy migration lại nếu cần

## 📝 Alternative: Local Migration

Nếu muốn chạy từ local:

```bash
# Set environment variables
export POSTGRES_URL=your-vercel-postgres-url
export DATABASE_URL=your-vercel-postgres-url
export NODE_ENV=production

# Build và chạy
npm run build:backend
npm run migrate:prod
```

## 🆘 Troubleshooting

### Error: "Unauthorized"
- Kiểm tra `MIGRATION_SECRET` đã được set đúng chưa
- Kiểm tra secret key trong request header/body

### Error: "Database URL not configured"
- Kiểm tra `POSTGRES_URL` hoặc `DATABASE_URL` đã được set chưa

### Error: "Connection failed"
- Kiểm tra database connection string
- Kiểm tra database có đang accessible không

Xem `MIGRATION_GUIDE.md` để biết thêm chi tiết.

