# 🔧 Fix Frontend 404 - Chi Tiết

## 🔍 Vấn Đề

Frontend vẫn báo 404 NOT_FOUND sau khi redeploy:
- URL: https://iuba-system.vercel.app
- Status: 404 NOT_FOUND
- API: ✅ Working (200 OK)

## 🔧 Đã Thực Hiện

### 1. Kiểm Tra Build Output

```bash
ls -la frontend/dist/
```

**Expected:**
- `index.html` ✅
- `assets/` folder ✅
- Static files ✅

### 2. Cập Nhật vercel.json

**Current Configuration:**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "npm install && cd frontend && npm install",
  "framework": null,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.ts"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "functions": {
    "api/index.ts": {
      "runtime": "@vercel/node"
    }
  }
}
```

### 3. Đã Commit Changes

- Code đã được commit
- Sẵn sàng để redeploy

## 🚀 Giải Pháp

### Option 1: Redeploy từ Vercel Dashboard (Khuyên Dùng)

1. **Vào Vercel Dashboard:**
   - https://vercel.com/hoangminhs-projects-b3d2c6bb/iuba-system

2. **Vào tab Settings:**
   - Build & Development Settings
   - Verify:
     - **Build Command**: `npm run build`
     - **Output Directory**: `frontend/dist`
     - **Install Command**: `npm install && cd frontend && npm install`

3. **Vào tab Deployments:**
   - Click vào deployment mới nhất
   - Click "..." → **Redeploy**
   - **QUAN TRỌNG**: **KHÔNG** chọn "Use existing Build Cache"
   - Click **Redeploy**

4. **Đợi deployment hoàn thành** (~2-3 phút)

5. **Test lại:**
   - https://iuba-system.vercel.app

### Option 2: Push Code Lên GitHub (Auto-Deploy)

```bash
cd /Users/hoangminh/Desktop/KETOAN_AUTOMATION/iuba-system
git push
```

Vercel sẽ tự động deploy khi có push mới.

### Option 3: Delete và Recreate Project

Nếu vẫn không hoạt động:

1. **Delete project trên Vercel:**
   - Settings → Delete Project

2. **Tạo lại project:**
   - Add New Project
   - Import GitHub repository
   - Cấu hình:
     - Framework: Other
     - Build Command: `npm run build`
     - Output Directory: `frontend/dist`
     - Install Command: `npm install && cd frontend && npm install`

3. **Add Environment Variables:**
   - POSTGRES_URL
   - JWT_SECRET
   - NODE_ENV

4. **Deploy**

## 🔍 Debugging

### Kiểm Tra Deployment Logs

1. Vercel Dashboard → Deployments
2. Click vào deployment
3. Click **View Build Logs**
4. Kiểm tra:
   - Build có thành công không?
   - `frontend/dist/index.html` có được tạo không?
   - Static files có được copy không?

### Kiểm Tra Build Output

Trong build logs, kiểm tra:
```
✓ built in 2.73s
dist/index.html
dist/assets/...
```

### Kiểm Tra Routing

Verify `vercel.json` rewrites:
- `/api/*` → `/api/index.ts` ✅
- `/*` → `/index.html` ✅

## 🎯 Alternative Configuration

Nếu vẫn không hoạt động, thử config này:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "frontend/dist",
  "framework": null,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.ts"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "functions": {
    "api/index.ts": {
      "runtime": "@vercel/node"
    }
  }
}
```

**Khác biệt:**
- Bỏ `installCommand` (Vercel tự detect)
- Giữ nguyên `rewrites`

## 📝 Checklist

Trước khi redeploy, đảm bảo:

- ✅ `vercel.json` tồn tại
- ✅ `frontend/dist/index.html` tồn tại (sau build)
- ✅ Build command đúng: `npm run build`
- ✅ Output directory đúng: `frontend/dist`
- ✅ Environment variables đã set
- ✅ API function (`api/index.ts`) tồn tại

## 🆘 Nếu Vẫn Không Hoạt Động

1. **Kiểm tra Vercel Dashboard → Settings:**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `frontend/dist`

2. **Kiểm tra build logs:**
   - Có lỗi build không?
   - Files có được tạo đúng không?

3. **Test local build:**
   ```bash
   cd /Users/hoangminh/Desktop/KETOAN_AUTOMATION/iuba-system
   npm run build
   ls -la frontend/dist/
   ```

4. **Contact Vercel Support:**
   - Vercel Dashboard → Help → Support
   - Provide deployment logs và vercel.json

---

**Status**: ⚠️ Pending Redeploy  
**Action**: Redeploy từ Vercel Dashboard (không dùng cache)
