# Hướng Dẫn Triển Khai Lên Vercel

Hệ thống IUBA đã được cấu hình để triển khai lên Vercel với:
- ✅ Backend: NestJS Serverless Functions
- ✅ Frontend: React Static Build
- ✅ Database: Vercel Postgres

## Yêu Cầu

- Node.js 18+
- Vercel CLI (`npm i -g vercel`)
- Vercel account

## Các Bước Triển Khai

### 1. Cài Đặt Dependencies

```bash
# Cài đặt dependencies cho root project
npm install

# Cài đặt dependencies cho frontend
cd frontend && npm install && cd ..
```

### 2. Tạo Vercel Postgres Database

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project hoặc tạo project mới
3. Vào **Storage** tab
4. Click **Create Database** → Chọn **Postgres**
5. Đặt tên database (ví dụ: `iuba-postgres`)
6. Copy **Connection String** (sẽ dùng làm `POSTGRES_URL`)

### 3. Cấu Hình Environment Variables

Trên Vercel Dashboard, vào **Settings** → **Environment Variables**, thêm:

- **`POSTGRES_URL`**: Connection string từ Vercel Postgres
  - Hoặc dùng `DATABASE_URL` (Vercel tự động tạo nếu dùng Vercel Postgres)
- **`JWT_SECRET`**: Secret key cho JWT (tạo random string)
  - Có thể dùng: `openssl rand -base64 32`
- **`NODE_ENV`**: `production`

### 4. Test Build Locally (Optional)

```bash
# Test build
npm run build
```

### 5. Deploy Lên Vercel

#### Cách 1: Sử dụng Vercel CLI

```bash
# Login vào Vercel
vercel login

# Deploy (lần đầu sẽ hỏi cấu hình)
vercel

# Deploy production
vercel --prod
```

#### Cách 2: Deploy Qua GitHub

1. Push code lên GitHub repository
2. Vào [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New Project**
4. Import GitHub repository
5. Cấu hình:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `frontend/dist`
6. Add Environment Variables (như bước 3)
7. Click **Deploy**

### 6. Database Migration

Sau khi deploy lần đầu:

1. Vào Vercel Dashboard → Project → **Functions** tab
2. Trigger một API call bất kỳ (ví dụ: `/api/health`)
3. Database sẽ tự động được tạo tables với `synchronize: true` (chỉ trong development)
4. Admin user sẽ tự động được tạo với:
   - Username: `admin`
   - Password: `admin123`

**Lưu ý:** Trong production, nên disable `synchronize` và dùng migrations.

## Cấu Trúc Triển Khai

```
vercel.json
├── builds
│   ├── api/index.ts → Serverless Function
│   └── frontend/ → Static Build
└── routes
    ├── /api/* → Backend API
    └── /* → Frontend React App
```

## Environment Variables

### Development (Local)

Tạo file `.env.local`:

```env
POSTGRES_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Production (Vercel)

Set trong Vercel Dashboard → Settings → Environment Variables:

- `POSTGRES_URL`: Tự động từ Vercel Postgres
- `JWT_SECRET`: Your secret key
- `NODE_ENV`: production

## Kiểm Tra Sau Khi Deploy

1. **Frontend**: Truy cập URL Vercel đã cung cấp
2. **Backend API**: Truy cập `https://your-domain.vercel.app/api/health`
3. **Database**: Kiểm tra trong Vercel Dashboard → Storage

## Troubleshooting

### Lỗi Database Connection

- Kiểm tra `POSTGRES_URL` có đúng không
- Đảm bảo SSL được enable trong production
- Kiểm tra connection limits (đã set max 5 connections)

### Lỗi Build

- Kiểm tra logs trong Vercel Dashboard
- Đảm bảo tất cả dependencies đã được cài đặt
- Kiểm tra Node.js version (cần 18+)

### Lỗi Cold Start

- Serverless functions có thể mất vài giây khi cold start
- App instance được cache để giảm cold start time

## Migration từ SQLite

Nếu đã có dữ liệu trong SQLite:

1. Export data từ SQLite
2. Import vào Vercel Postgres
3. Hoặc sử dụng migration script

## Hỗ Trợ

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [NestJS on Vercel](https://docs.nestjs.com/)

