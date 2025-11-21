# 🔧 Fix Vercel Build Error - Không Dùng vercel.json

## ❌ Vấn Đề

Lỗi `Function Runtimes must have a valid version` vẫn xuất hiện mặc dù đã thử nhiều cách cấu hình `vercel.json`.

**Root Cause:**
- Vercel không tương thích với một số config trong `vercel.json`
- Auto-detection sẽ hoạt động tốt hơn

## ✅ Giải Pháp: Xóa vercel.json

### 1. Đã Xóa vercel.json

Không cần `vercel.json` nữa. Vercel sẽ tự động detect:
- `api/index.ts` → Serverless function với `@vercel/node`
- `frontend/dist` → Static build output

### 2. Cấu Hình Trong Vercel Dashboard

**QUAN TRỌNG:** Phải cấu hình trong Vercel Dashboard:

1. **Vào Vercel Dashboard:**
   - https://vercel.com/hoangminhs-projects-b3d2c6bb/iuba-system/settings

2. **Build & Development Settings:**
   - **Framework Preset**: `Other`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install && cd frontend && npm install`
   - **Node.js Version**: `18.x` hoặc `20.x`

3. **Save Settings**

### 3. Routing Configuration

**Option A: Tạo vercel.json chỉ với rewrites (nếu cần)**

Tạo lại file `vercel.json` rất đơn giản:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.ts"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Option B: Cấu hình trong Vercel Dashboard**

1. Settings → Rewrites
2. Add Rewrite:
   - Source: `/api/(.*)`
   - Destination: `/api/index.ts`
3. Add Rewrite:
   - Source: `/(.*)`
   - Destination: `/index.html`

### 4. Environment Variables

Đảm bảo đã set trong Vercel Dashboard → Settings → Environment Variables:
- `POSTGRES_URL`
- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV`: `production`

## 🚀 Deploy

Sau khi cấu hình Dashboard:

1. **Redeploy từ Dashboard:**
   - Deployments → Click latest → Redeploy
   - **KHÔNG** dùng build cache

2. **Hoặc push code mới:**
   ```bash
   git push origin main
   ```
   - Vercel sẽ auto-deploy nếu connected với GitHub

## ✅ Expected Behavior

Vercel sẽ tự động:
- ✅ Detect `api/index.ts` → Serverless function
- ✅ Detect `frontend/dist` → Static files
- ✅ Build backend (nest build)
- ✅ Build frontend (vite build)
- ✅ Deploy cả hai

## 🔍 Verification

Sau khi deploy:

1. **Check Build Logs:**
   - Vercel Dashboard → Deployments → Click deployment → View Build Logs
   - Verify: Build thành công, không có lỗi runtime

2. **Test:**
   - Frontend: https://iuba-system.vercel.app
   - API: https://iuba-system.vercel.app/api/health

## 📝 package.json Config

Đã thêm vào `package.json`:

```json
{
  "engines": {
    "node": ">=18.x"
  }
}
```

Điều này giúp Vercel biết dùng Node.js 18+.

## 🆘 Nếu Vẫn Lỗi

1. **Kiểm tra Vercel Dashboard Settings:**
   - Build Command đúng chưa?
   - Output Directory đúng chưa?
   - Node.js version đã set chưa?

2. **Kiểm tra Build Logs:**
   - Xem lỗi cụ thể ở đâu
   - Verify dependencies có được cài đặt không

3. **Test Build Local:**
   ```bash
   npm run build
   ```
   - Đảm bảo build thành công local

4. **Clear Build Cache:**
   - Vercel Dashboard → Deployments
   - Redeploy với "Clear build cache" enabled

---

**Status**: ✅ vercel.json đã được xóa  
**Action**: Cấu hình trong Vercel Dashboard  
**Expected**: Build sẽ thành công với auto-detection

