# 🔧 Fix Login Internal Error

## Vấn đề
Đăng nhập báo "internal error" trên Vercel production.

## Nguyên nhân có thể
1. **JWT_SECRET không được set** trên Vercel
2. **Database connection issue** - PostgreSQL chưa được setup
3. **Environment variables** chưa được cấu hình

## ✅ Đã sửa

### 1. Cập nhật JWT_SECRET để dùng environment variable
- `src/auth/auth.module.ts` - dùng `process.env.JWT_SECRET`
- `src/auth/jwt.strategy.ts` - dùng `process.env.JWT_SECRET`

### 2. Cải thiện error handling
- `api/index.ts` - thêm try-catch và error logging
- `src/auth/auth.controller.ts` - thêm error logging
- `src/auth/auth.service.ts` - cải thiện error handling

## 🔧 Cần làm trên Vercel Dashboard

### 1. Set Environment Variables

Vào **Vercel Dashboard → Settings → Environment Variables**, thêm:

```
JWT_SECRET=your-secret-key-here (dùng: openssl rand -base64 32)
POSTGRES_URL=your-postgres-connection-string
DATABASE_URL=your-postgres-connection-string (nếu khác POSTGRES_URL)
NODE_ENV=production
```

### 2. Tạo Vercel Postgres Database (nếu chưa có)

1. Vào **Vercel Dashboard → Storage**
2. Click **Create Database** → **Postgres**
3. Copy **Connection String**
4. Set làm `POSTGRES_URL` và `DATABASE_URL`

### 3. Redeploy

Sau khi set environment variables:

```bash
vercel --prod
```

Hoặc trigger redeploy từ Vercel Dashboard.

## 🧪 Test

1. **Test API health:**
   ```bash
   curl https://your-domain.vercel.app/api/health
   ```

2. **Test login:**
   ```bash
   curl -X POST https://your-domain.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

3. **Check logs:**
   - Vercel Dashboard → Deployments → Click deployment → Functions → View logs

## 📝 Lưu ý

- Admin user sẽ tự động được tạo khi database được khởi tạo
- Username: `admin`
- Password: `admin123`
- Database tables sẽ tự động được tạo với `synchronize: true` (chỉ trong development mode)

