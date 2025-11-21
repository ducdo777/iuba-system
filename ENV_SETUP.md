# 🔧 Environment Variables Setup - Neon Postgres

## ✅ Đã Setup

Environment variables đã được cấu hình cho Vercel deployment với **Neon Postgres**.

### Database Configuration

**Neon Postgres Connection:**
- **POSTGRES_URL**: `postgresql://neondb_owner:npg_S7jZJufYV1Xn@ep-purple-glitter-a1p12ihz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
- **DATABASE_URL**: Same as POSTGRES_URL
- **Host**: `ep-purple-glitter-a1p12ihz-pooler.ap-southeast-1.aws.neon.tech`
- **Database**: `neondb`
- **User**: `neondb_owner`
- **Region**: `ap-southeast-1` (AWS)

### Environment Variables

#### Production Environment
- ✅ `POSTGRES_URL`: Neon Postgres connection string
- ✅ `DATABASE_URL`: Neon Postgres connection string (backup)
- ✅ `JWT_SECRET`: Generated secret key (auto-generated)
- ✅ `NODE_ENV`: `production`

#### Preview Environment
- ✅ `POSTGRES_URL`: Neon Postgres connection string
- ✅ `DATABASE_URL`: Neon Postgres connection string (backup)
- ✅ `JWT_SECRET`: Generated secret key (same as production)
- ✅ `NODE_ENV`: `production`

## 📝 Commands

### View Environment Variables

```bash
cd /Users/hoangminh/Desktop/KETOAN_AUTOMATION/iuba-system
vercel env ls
```

### Update Environment Variable

```bash
# Update POSTGRES_URL
echo 'postgresql://...' | vercel env add POSTGRES_URL production

# Update JWT_SECRET
echo 'new-secret' | vercel env add JWT_SECRET production
```

### Pull Environment Variables

```bash
# Pull production env
vercel env pull .env.production --environment=production

# Pull preview env
vercel env pull .env.preview --environment=preview
```

## 🔄 Redeploy

Sau khi update environment variables, redeploy:

```bash
vercel --prod
```

Hoặc redeploy từ Vercel Dashboard.

## 🧪 Test Connection

### Test Health Check

```bash
curl https://iuba-system-g56hl4ruv-hoangminhs-projects-b3d2c6bb.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "IUBA System API"
}
```

### Test Database Connection

Database connection sẽ được test khi:
1. API được gọi lần đầu (cold start)
2. Login endpoint được gọi: `/api/auth/login`
3. Any database operation

## 📚 Neon Postgres Documentation

- [Neon Postgres Docs](https://neon.tech/docs)
- [Connection String Format](https://neon.tech/docs/connect/connect-from-any-app)
- [SSL Mode](https://neon.tech/docs/connect/connect-securely)

## 🔐 Security Notes

1. **Connection String**: Chứa password, được bảo mật trong Vercel environment variables
2. **JWT_SECRET**: Được generate tự động, chỉ visible trong Vercel Dashboard
3. **SSL Mode**: `require` - Connections phải dùng SSL
4. **Pooler**: Đang dùng connection pooler (`-pooler`) để optimize serverless connections

## 🆘 Troubleshooting

### Database Connection Error

**Error:** `Connection refused` or `timeout`

**Solutions:**
1. Kiểm tra `POSTGRES_URL` đã được set đúng chưa
2. Kiểm tra Neon database status: https://console.neon.tech
3. Kiểm tra firewall/IP whitelist (nếu có)
4. Verify SSL mode: `sslmode=require`

### SSL Error

**Error:** `SSL connection required`

**Solutions:**
1. Đảm bảo connection string có `?sslmode=require`
2. Kiểm tra Neon database có enable SSL chưa

### Connection Pool Exhausted

**Error:** `too many connections`

**Solutions:**
1. Đang dùng pooler, nên giới hạn connections sẽ cao hơn
2. Kiểm tra connection limits trong Neon dashboard
3. Tối ưu connection pooling settings trong app.module.ts

## 🎯 Next Steps

1. ✅ **Test Database Connection**: Gọi API để test connection
2. ✅ **Verify Tables**: Kiểm tra tables đã được tạo chưa
3. ✅ **Test Authentication**: Login với `admin` / `admin123`
4. ✅ **Monitor Logs**: Xem logs trong Vercel Dashboard

## 📊 Connection Details

- **Provider**: Neon
- **Type**: PostgreSQL
- **Pooling**: Enabled (pgbouncer)
- **SSL**: Required
- **Region**: ap-southeast-1 (Singapore)
- **Connection Method**: Connection String (POSTGRES_URL)

---

**Setup Date:** 2025-11-21  
**Database:** Neon Postgres  
**Status:** ✅ Configured
