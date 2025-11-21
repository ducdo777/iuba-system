# 🚀 Hướng Dẫn Triển Khai Lên Vercel

## ✅ Đã Cấu Hình

Hệ thống IUBA đã được cấu hình sẵn để triển khai lên Vercel với:
- ✅ Backend: NestJS Serverless Functions (`api/index.ts`)
- ✅ Frontend: React Static Build
- ✅ Database: Hỗ trợ cả SQLite (local) và PostgreSQL (Vercel)
- ✅ Cấu hình tự động chuyển database dựa trên environment

## 📋 Yêu Cầu

- Node.js 18+
- Vercel CLI: `npm i -g vercel`
- Tài khoản Vercel

## 🔧 Các Bước Triển Khai

### Bước 1: Cài Đặt Dependencies

```bash
cd /Users/hoangminh/Desktop/KETOAN_AUTOMATION/iuba-system

# Cài đặt dependencies cho root project
npm install

# Cài đặt dependencies cho frontend
cd frontend && npm install && cd ..
```

### Bước 2: Tạo Vercel Postgres Database

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project hoặc tạo project mới
3. Vào tab **Storage**
4. Click **Create Database** → Chọn **Postgres**
5. Đặt tên database (ví dụ: `iuba-postgres`)
6. Chọn region gần nhất
7. Copy **Connection String** (sẽ dùng làm `POSTGRES_URL`)

### Bước 3: Cấu Hình Environment Variables

Trên Vercel Dashboard → **Settings** → **Environment Variables**, thêm:

| Variable | Value | Mô tả |
|----------|-------|-------|
| `POSTGRES_URL` | `postgresql://...` | Connection string từ Vercel Postgres |
| `JWT_SECRET` | Random string | Secret key cho JWT (dùng `openssl rand -base64 32`) |
| `NODE_ENV` | `production` | Environment |

**Lưu ý:** Nếu dùng Vercel Postgres, `DATABASE_URL` sẽ tự động được tạo. Code sẽ tự động detect.

### Bước 4: Test Build Local (Optional)

```bash
# Test build backend
npm run build:backend

# Test build frontend
cd frontend && npm run build && cd ..
```

### Bước 5: Deploy Lên Vercel

#### Option A: Sử dụng Vercel CLI (Khuyên dùng)

```bash
# Login vào Vercel
vercel login

# Deploy lần đầu (sẽ hỏi cấu hình)
vercel

# Set environment variables (nếu chưa set trong Dashboard)
vercel env add POSTGRES_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV

# Deploy production
vercel --prod
```

#### Option B: Deploy Qua GitHub

1. **Push code lên GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import vào Vercel:**
   - Vào [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New Project**
   - Import GitHub repository
   - Cấu hình:
     - **Framework Preset**: Other
     - **Root Directory**: `./`
     - **Build Command**: `npm run vercel-build`
     - **Output Directory**: `frontend/dist`
     - **Install Command**: `npm install && cd frontend && npm install`

3. **Add Environment Variables:**
   - Trong project settings, thêm các env variables như Bước 3

4. **Deploy:**
   - Click **Deploy**

### Bước 6: Database Migration (Quan Trọng!)

Sau khi deploy lần đầu:

1. **Tạo tables tự động:**
   - Vào Vercel Dashboard → Project → **Functions** tab
   - Trigger một API call: `/api/health` hoặc `/api/auth/login`
   - Database sẽ tự động tạo tables với `synchronize: true` (chỉ lần đầu)
   - Admin user sẽ tự động được tạo:
     - **Username:** `admin`
     - **Password:** `admin123`

2. **Hoặc sử dụng Vercel CLI để chạy migration:**
   ```bash
   # Connect vào Vercel environment
   vercel env pull .env.production
   
   # Chạy migration script (nếu có)
   npm run migrate
   ```

### Bước 7: Kiểm Tra Deployment

1. **Frontend:** Truy cập URL Vercel đã cung cấp
2. **Backend API:** 
   - Health check: `https://your-domain.vercel.app/api/health`
   - Test login: `https://your-domain.vercel.app/api/auth/login`
3. **Database:** Kiểm tra trong Vercel Dashboard → Storage → Postgres

## 📁 Cấu Trúc Files Đã Tạo

```
iuba-system/
├── api/
│   ├── index.ts          # Serverless function handler
│   └── tsconfig.json     # TypeScript config cho api
├── vercel.json           # Vercel configuration
├── .vercelignore         # Files to ignore khi deploy
├── README_VERCEL.md      # Hướng dẫn chi tiết
└── DEPLOY_VERCEL.md      # File này
```

## 🔄 Cấu Hình Database Tự Động

Hệ thống tự động detect database type:
- **Local development:** Sử dụng SQLite (`iuba.db`)
- **Vercel production:** Sử dụng PostgreSQL từ `POSTGRES_URL` hoặc `DATABASE_URL`

## ⚠️ Lưu Ý Quan Trọng

### 1. Connection Pooling
- Vercel serverless functions có giới hạn connections
- Đã cấu hình `max: 5` connections để tránh quá tải

### 2. Cold Start
- Serverless functions có thể mất 1-3 giây khi cold start
- App instance được cache để giảm thời gian cold start

### 3. Database Synchronize
- **Development:** `synchronize: true` (tự động tạo/update tables)
- **Production:** `synchronize: false` (nên dùng migrations)

### 4. Environment Variables
- Phải set đúng `POSTGRES_URL` hoặc `DATABASE_URL`
- `JWT_SECRET` phải được set để authentication hoạt động

### 5. Build Timeout
- Vercel có timeout 60 giây cho build
- Nếu build lâu, cần optimize hoặc liên hệ Vercel

## 🐛 Troubleshooting

### Lỗi: Database Connection Failed

**Giải pháp:**
1. Kiểm tra `POSTGRES_URL` có đúng không
2. Đảm bảo SSL được enable trong production
3. Kiểm tra database đã được tạo trong Vercel Dashboard
4. Test connection string bằng psql hoặc tool khác

### Lỗi: Build Failed

**Giải pháp:**
1. Kiểm tra logs trong Vercel Dashboard
2. Đảm bảo tất cả dependencies đã được cài đặt
3. Kiểm tra Node.js version (cần 18+)
4. Test build local trước: `npm run build`

### Lỗi: Function Timeout

**Giải pháp:**
1. Kiểm tra queries có quá lâu không
2. Optimize database queries
3. Tăng connection timeout trong app.module.ts

### Lỗi: CORS

**Giãi pháp:**
- CORS đã được enable trong `api/index.ts`
- Kiểm tra frontend URL có match với CORS config không

## 📊 Monitoring

Sau khi deploy, theo dõi:
- **Functions:** Vercel Dashboard → Functions tab
- **Logs:** Vercel Dashboard → Logs tab
- **Analytics:** Vercel Dashboard → Analytics tab
- **Database:** Vercel Dashboard → Storage → Postgres

## 🔐 Security Checklist

- ✅ JWT_SECRET được set
- ✅ Database connection string được bảo mật
- ✅ CORS được cấu hình đúng
- ✅ HTTPS được enable tự động (Vercel default)
- ⚠️ Disable `synchronize: true` trong production (nên dùng migrations)

## 📝 Next Steps

1. **Sau khi deploy thành công:**
   - Đăng nhập với `admin` / `admin123`
   - Tạo teams và users mới
   - Test các chức năng

2. **Tối ưu hóa:**
   - Disable synchronize, dùng migrations
   - Tối ưu database queries
   - Setup monitoring và alerts

3. **Backup:**
   - Regular backup Vercel Postgres
   - Export data định kỳ

## 🆘 Hỗ Trợ

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)

---

**Chúc bạn deploy thành công! 🎉**
