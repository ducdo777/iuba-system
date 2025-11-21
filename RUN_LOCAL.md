# 🚀 Chạy Local Test với Backend Production Build

## Mô Tả

Chạy ứng dụng IUBA System local với:
- **Backend**: Production build (từ `dist/`) - giống như Vercel build
- **Frontend**: Dev server với hot reload (Vite)

## 📋 Setup

### 1. Build Backend (nếu chưa build)

```bash
cd /Users/hoangminh/Desktop/KETOAN_AUTOMATION/iuba-system
npm run build:backend
```

### 2. Environment Variables

Tạo file `.env.local` (đã tự động tạo):

```bash
NODE_ENV=development
JWT_SECRET=local-dev-secret-key
```

**Note**: 
- Backend sẽ dùng SQLite (`iuba.db`) khi `NODE_ENV=development`
- Để dùng PostgreSQL (production DB), uncomment trong `.env.local`:
  ```
  POSTGRES_URL=postgresql://...
  DATABASE_URL=postgresql://...
  ```

### 3. Frontend API Configuration

File `frontend/src/services/api.ts` đã được cấu hình:
- Local dev: Dùng `/api` (Vite proxy tự động route tới `http://localhost:3002`)
- Production: Dùng `/api` (Vercel proxy)

**Vite proxy config** (đã có trong `vite.config.ts`):
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3002',
      changeOrigin: true,
    },
  },
}
```

## 🚀 Chạy Ứng Dụng

### Option 1: Dùng Script (Khuyên dùng)

```bash
cd /Users/hoangminh/Desktop/KETOAN_AUTOMATION/iuba-system
./run-local.sh
```

Script sẽ:
- ✅ Build backend nếu chưa build
- ✅ Install dependencies nếu chưa có
- ✅ Start backend (production build)
- ✅ Start frontend (dev server)
- ✅ Check health status
- ✅ Show URLs và login info

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd /Users/hoangminh/Desktop/KETOAN_AUTOMATION/iuba-system
export NODE_ENV=development
export JWT_SECRET=local-dev-secret-key
npm run start:prod
```

**Terminal 2 - Frontend:**
```bash
cd /Users/hoangminh/Desktop/KETOAN_AUTOMATION/iuba-system/frontend
npm run dev
```

## 📍 URLs

- **Backend API**: http://localhost:3002
- **Frontend Dev**: http://localhost:5173
- **API Health Check**: http://localhost:3002/api/health

## 🔐 Login

**Default Admin Account:**
- Username: `admin`
- Password: `admin123`

## 🧪 Test

### 1. Test Backend Health

```bash
curl http://localhost:3002/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "IUBA System API"
}
```

### 2. Test Frontend

1. Open browser: http://localhost:5173
2. Login với admin/admin123
3. Test các tính năng:
   - Admin dashboard
   - User management
   - Team management
   - Activity data input
   - Statistics

### 3. Test API từ Frontend

Frontend sẽ tự động kết nối với backend qua Vite proxy:
- Frontend calls: `/api/...`
- Vite proxy: `http://localhost:3002/api/...`

## 📝 Logs

**Backend Logs:**
```bash
tail -f backend.log
```

**Frontend Logs:**
```bash
tail -f frontend.log
```

Hoặc check console trong browser DevTools.

## 🛑 Stop Services

### Nếu dùng Script

Press `Ctrl+C` trong terminal chạy script.

### Nếu chạy Manual

**Stop Backend:**
```bash
pkill -f "node dist/main"
```

**Stop Frontend:**
```bash
pkill -f "vite"
```

Hoặc `Ctrl+C` trong từng terminal.

## 🔄 Database

### SQLite (Default cho Development)

- File: `iuba.db` (trong project root)
- Tự động tạo khi start backend
- Admin user tự động tạo (admin/admin123)

### PostgreSQL (Production Database)

Để test với production database:

1. **Uncomment trong `.env.local`:**
   ```
   POSTGRES_URL=postgresql://neondb_owner:npg_S7jZJufYV1Xn@ep-purple-glitter-a1p12ihz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   DATABASE_URL=postgresql://neondb_owner:npg_S7jZJufYV1Xn@ep-purple-glitter-a1p12ihz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

2. **Restart backend:**
   ```bash
   pkill -f "node dist/main"
   export $(cat .env.local | grep -v '^#' | xargs)
   npm run start:prod
   ```

## 🐛 Troubleshooting

### Backend không start

1. **Check port 3002 đã bị dùng:**
   ```bash
   lsof -i :3002
   ```

2. **Check logs:**
   ```bash
   tail -f backend.log
   ```

3. **Check database connection:**
   - SQLite: Check file `iuba.db` có tồn tại không
   - PostgreSQL: Check connection string trong `.env.local`

### Frontend không kết nối backend

1. **Check backend đang chạy:**
   ```bash
   curl http://localhost:3002/api/health
   ```

2. **Check Vite proxy config:**
   - File: `frontend/vite.config.ts`
   - Proxy target: `http://localhost:3002`

3. **Check browser console:**
   - Open DevTools → Console
   - Check CORS errors

### CORS Errors

Backend đã enable CORS:
```typescript
app.enableCors({
  origin: true,
  credentials: true,
});
```

Nếu vẫn lỗi, check backend logs.

## ✅ Verification Checklist

- [ ] Backend build thành công (`dist/main.js` exists)
- [ ] Backend start và health check OK
- [ ] Frontend start và accessible
- [ ] Login thành công với admin/admin123
- [ ] API calls hoạt động (check Network tab trong DevTools)
- [ ] Database connection OK (SQLite hoặc PostgreSQL)

## 📚 Related Files

- `package.json`: Backend scripts
- `frontend/package.json`: Frontend scripts
- `run-local.sh`: Startup script
- `.env.local`: Environment variables
- `frontend/vite.config.ts`: Vite proxy config
- `frontend/src/services/api.ts`: API client config

---

**Status**: ✅ Ready to run  
**Last Updated**: 2025-11-21

