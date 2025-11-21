# 🚀 Deploy Next.js lên Vercel

## ✅ Đã hoàn thành

- ✅ Migrate từ Vite sang Next.js
- ✅ Cấu hình static export
- ✅ Cập nhật vercel.json
- ✅ Code đã được commit

## 📤 Push lên GitHub

Code đã được commit với message: "Migrate from Vite to Next.js for better Vercel support"

**Để push lên GitHub, chạy:**

```bash
git push origin main
```

Nếu cần authentication:
- Sử dụng Personal Access Token
- Hoặc SSH key
- Hoặc GitHub Desktop

## 🔄 Vercel Auto-Deploy

Nếu Vercel đã connect với GitHub repository, nó sẽ tự động:
1. Detect push mới
2. Trigger build
3. Deploy với Next.js framework

## 🛠️ Manual Deploy với Vercel CLI

Nếu muốn deploy thủ công:

```bash
# Đảm bảo đã login
vercel login

# Deploy production
vercel --prod
```

## ⚙️ Vercel Dashboard Settings

Sau khi push, kiểm tra Vercel Dashboard:

1. **Settings → General**
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm install && cd frontend && npm install`

2. **Settings → Environment Variables**
   - `POSTGRES_URL`
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV`: `production`

## 📝 Lưu ý

- Next.js sẽ tự động detect và build
- Static export sẽ tạo files trong `frontend/dist`
- API routes vẫn hoạt động qua `/api/*` rewrite

## ✅ Verification

Sau khi deploy:

1. Check build logs trong Vercel Dashboard
2. Test frontend: `https://your-domain.vercel.app`
3. Test API: `https://your-domain.vercel.app/api/health`

