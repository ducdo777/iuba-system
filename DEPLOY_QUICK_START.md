# ⚡ Quick Start - Deploy lên Vercel

## 🚀 Deploy Nhanh (5 phút)

### 1. Cài Đặt Vercel CLI

```bash
npm i -g vercel
```

### 2. Login Vercel

```bash
vercel login
```

### 3. Tạo Vercel Postgres Database

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Tạo project mới hoặc chọn project có sẵn
3. **Storage** → **Create Database** → **Postgres**
4. Copy connection string

### 4. Deploy

```bash
cd /Users/hoangminh/Desktop/KETOAN_AUTOMATION/iuba-system

# Deploy lần đầu
vercel

# Set environment variables
vercel env add POSTGRES_URL
# Paste connection string khi được hỏi

vercel env add JWT_SECRET
# Nhập random string (hoặc dùng: openssl rand -base64 32)

# Deploy production
vercel --prod
```

### 5. Kiểm Tra

1. Copy URL Vercel đã cung cấp
2. Truy cập: `https://your-domain.vercel.app`
3. Đăng nhập:
   - **Username:** `admin`
   - **Password:** `admin123`

## ✅ Xong!

Hệ thống đã được deploy thành công lên Vercel! 🎉

---

## 📚 Chi Tiết Hơn

Xem file `DEPLOY_VERCEL.md` để biết chi tiết đầy đủ về deployment.
