# 📤 Hướng Dẫn Upload Lên GitHub Private Repository

## ✅ Đã Chuẩn Bị

- ✅ Git repository đã được khởi tạo
- ✅ `.gitignore` đã được cấu hình
- ✅ Code đã được commit
- ✅ Sẵn sàng để push lên GitHub

## 🚀 Các Bước Upload Lên GitHub

### Bước 1: Tạo GitHub Private Repository

1. Vào [GitHub](https://github.com)
2. Click **+** → **New repository**
3. Điền thông tin:
   - **Repository name:** `iuba-system` (hoặc tên bạn muốn)
   - **Description:** `Hệ thống quản lý IUBA với React frontend và NestJS backend`
   - **Visibility:** Chọn **Private** ✅
   - **Không** chọn "Initialize with README" (vì đã có code)
4. Click **Create repository**

### Bước 2: Lấy Repository URL

Sau khi tạo repository, GitHub sẽ hiển thị URL. Copy URL:
- HTTPS: `https://github.com/YOUR_USERNAME/iuba-system.git`
- SSH: `git@github.com:YOUR_USERNAME/iuba-system.git`

### Bước 3: Thêm Remote và Push

Chạy các lệnh sau trong terminal:

```bash
cd /Users/hoangminh/Desktop/KETOAN_AUTOMATION/iuba-system

# Thêm remote repository
git remote add origin https://github.com/YOUR_USERNAME/iuba-system.git
# Hoặc dùng SSH: git remote add origin git@github.com:YOUR_USERNAME/iuba-system.git

# Đổi tên branch thành main (nếu cần)
git branch -M main

# Push code lên GitHub
git push -u origin main
```

### Bước 4: Xác Thực (Nếu Cần)

Nếu dùng HTTPS:
- GitHub có thể yêu cầu username và password
- Nếu dùng Personal Access Token:
  - Username: GitHub username
  - Password: Personal Access Token (không phải password)

**Tạo Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Chọn scopes: `repo` (full control of private repositories)
4. Copy token và dùng làm password

## 📋 Lệnh Nhanh

### Tất Cả Các Lệnh Trong Một Lần

```bash
cd /Users/hoangminh/Desktop/KETOAN_AUTOMATION/iuba-system

# Nếu chưa có git repo
git init

# Kiểm tra status
git status

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit: IUBA System với React frontend và NestJS backend"

# Thêm remote (THAY YOUR_USERNAME và REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push lên GitHub
git branch -M main
git push -u origin main
```

## 🔐 Sử dụng SSH (Khuyên Dùng)

Nếu muốn dùng SSH (không cần nhập password mỗi lần):

### 1. Tạo SSH Key (Nếu Chưa Có)

```bash
# Kiểm tra xem đã có SSH key chưa
ls -la ~/.ssh

# Nếu chưa có, tạo mới
ssh-keygen -t ed25519 -C "your_email@example.com"
# Nhấn Enter để accept default location
# Nhấn Enter để không set passphrase (hoặc set nếu muốn)
```

### 2. Thêm SSH Key Vào GitHub

```bash
# Copy public key
cat ~/.ssh/id_ed25519.pub
# Hoặc
pbcopy < ~/.ssh/id_ed25519.pub
```

1. Vào GitHub → Settings → SSH and GPG keys
2. Click **New SSH key**
3. Paste public key vào
4. Click **Add SSH key**

### 3. Dùng SSH URL

```bash
# Thay HTTPS bằng SSH
git remote set-url origin git@github.com:YOUR_USERNAME/iuba-system.git

# Push
git push -u origin main
```

## ✅ Kiểm Tra Sau Khi Push

1. Vào GitHub repository
2. Kiểm tra tất cả files đã được upload
3. Kiểm tra `.gitignore` có hoạt động đúng (không có `node_modules`, `.db` files)

## 🔄 Cập Nhật Code Sau Này

Khi có thay đổi code:

```bash
cd /Users/hoangminh/Desktop/KETOAN_AUTOMATION/iuba-system

# Xem thay đổi
git status

# Add files đã thay đổi
git add .

# Commit
git commit -m "Mô tả thay đổi"

# Push lên GitHub
git push
```

## 📝 Lưu Ý

### Files Đã Được Ignore

Các files sau sẽ **KHÔNG** được upload lên GitHub (theo `.gitignore`):
- `node_modules/` - Dependencies
- `*.db` - Database files
- `.env*` - Environment variables
- `dist/` - Build outputs
- `.vercel/` - Vercel config

### Files Quan Trọng Đã Được Commit

- ✅ Source code (TypeScript, React)
- ✅ Configuration files (`package.json`, `tsconfig.json`, etc.)
- ✅ Documentation (README, DEPLOY guides)
- ✅ Build scripts
- ✅ Vercel configuration

## 🆘 Troubleshooting

### Lỗi: Remote Already Exists

```bash
# Kiểm tra remote hiện tại
git remote -v

# Xóa remote cũ (nếu cần)
git remote remove origin

# Thêm lại
git remote add origin https://github.com/YOUR_USERNAME/iuba-system.git
```

### Lỗi: Authentication Failed

**Giải pháp:**
1. Dùng Personal Access Token thay vì password
2. Hoặc setup SSH key
3. Hoặc dùng GitHub CLI: `gh auth login`

### Lỗi: Large Files

Nếu có files lớn (>100MB):
- GitHub có giới hạn file size
- Kiểm tra và remove files lớn không cần thiết
- Hoặc dùng Git LFS

### Lỗi: Branch Protection

Nếu branch `main` được protect:
- Cần tạo branch khác trước
- Sau đó tạo Pull Request

## 🎯 Next Steps

Sau khi upload lên GitHub:

1. **Connect Vercel với GitHub:**
   - Vercel Dashboard → Add New Project
   - Import GitHub repository
   - Auto-deploy khi có push

2. **Setup GitHub Actions** (nếu cần):
   - CI/CD pipelines
   - Automated testing
   - Auto deployment

3. **Add Collaborators:**
   - Settings → Collaborators
   - Invite team members

---

**Sau khi push thành công, bạn sẽ có:**
- ✅ Code được backup trên GitHub
- ✅ Version control
- ✅ Có thể collaborate với team
- ✅ Sẵn sàng cho Vercel deployment

**Chúc bạn upload thành công! 🎉**
