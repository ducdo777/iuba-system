# 🎯 Hệ Thống Quản Lý IUBA

Hệ thống quản lý IUBA với React frontend, NestJS backend, và hỗ trợ triển khai lên Vercel.

## ✨ Tính Năng

### Frontend (React + TypeScript)
- ✅ Responsive design (mobile-first)
- ✅ Inline editing cho nhập dữ liệu nhanh
- ✅ Authentication với JWT
- ✅ Protected routes
- ✅ Modern UI với CSS

### Backend (NestJS + TypeORM)
- ✅ RESTful API
- ✅ JWT Authentication
- ✅ Role-based access control (Admin/User)
- ✅ Database: PostgreSQL (Vercel) / SQLite (Local)
- ✅ Serverless functions support

### Dữ Liệu Quản Lý
- ✅ Quản lý Users (Admin/User roles)
- ✅ Quản lý Teams
- ✅ Nhập dữ liệu hoạt động:
  - Đơn thuần
  - Hữu hiệu
  - Baptem
  - Thờ phượng
  - Lập CLB
  - Lên giai đoạn
- ✅ Thống kê chi tiết theo Team và User

## 🚀 Quick Start

### Local Development

```bash
# Cài đặt dependencies
npm install
cd frontend && npm install && cd ..

# Chạy backend (port 3002)
npm run start:dev

# Chạy frontend (port 3003)
cd frontend && npm run dev
```

### Truy Cập

- **Frontend:** http://localhost:3003
- **Backend API:** http://localhost:3002/api
- **Admin Login:** `admin` / `admin123`

## 📦 Deployment

### Vercel Deployment

Xem file `DEPLOY_VERCEL.md` hoặc `DEPLOY_QUICK_START.md` để biết chi tiết.

### GitHub Upload

Xem file `GITHUB_DEPLOY.md` để upload code lên GitHub private repository.

## 📁 Cấu Trúc Project

```
iuba-system/
├── api/                    # Serverless functions (Vercel)
│   └── index.ts
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Pages (Admin/User)
│   │   ├── services/      # API services
│   │   └── contexts/      # React contexts
│   └── dist/              # Build output
├── src/                    # NestJS backend
│   ├── auth/              # Authentication
│   ├── users/             # User management
│   ├── teams/             # Team management
│   ├── activity-data/     # Activity data CRUD
│   └── statistics/        # Statistics service
├── vercel.json            # Vercel configuration
└── package.json           # Root dependencies
```

## 🔧 Cấu Hình

### Environment Variables

#### Local Development
Tạo file `.env.local`:
```env
POSTGRES_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key
NODE_ENV=development
```

#### Vercel Production
Set trong Vercel Dashboard:
- `POSTGRES_URL`: Từ Vercel Postgres
- `JWT_SECRET`: Secret key cho JWT
- `NODE_ENV`: production

### Database

- **Local:** SQLite (`iuba.db`) - tự động tạo
- **Vercel:** PostgreSQL - cần tạo Vercel Postgres database

## 👥 Đăng Nhập

### Admin
- **Username:** `admin`
- **Password:** `admin123`
- **Quyền:** Full access (Users, Teams, Statistics)

### User
- Tạo user trong Admin panel
- **Quyền:** Chỉ xem/sửa dữ liệu của team mình

## 📚 Documentation

- `DEPLOY_VERCEL.md` - Hướng dẫn deploy lên Vercel
- `DEPLOY_QUICK_START.md` - Quick start deployment
- `GITHUB_DEPLOY.md` - Hướng dẫn upload lên GitHub
- `frontend/README.md` - Frontend documentation

## 🛠️ Tech Stack

### Backend
- NestJS 11
- TypeORM
- PostgreSQL / SQLite
- JWT Authentication
- bcryptjs

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- CSS (Responsive)

## 📝 License

UNLICENSED

## 👨‍💻 Author

Hệ thống IUBA Management System

---

**Chúc bạn sử dụng vui vẻ! 🎉**