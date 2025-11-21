# IUBA System - React Frontend

Frontend React cho Hệ thống IUBA với responsive design.

## Tính năng

- ✅ React với TypeScript
- ✅ React Router cho routing
- ✅ Axios cho API calls
- ✅ Responsive design (mobile-first)
- ✅ Authentication với JWT
- ✅ Protected routes
- ✅ Modern UI với CSS

## Cấu trúc

```
frontend/
├── src/
│   ├── components/        # Shared components
│   │   ├── Layout.tsx     # Main layout
│   │   └── ProtectedRoute.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── services/          # API services
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── teams.ts
│   │   ├── activityData.ts
│   │   └── statistics.ts
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── admin/         # Admin pages
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminUsers.tsx
│   │   │   ├── AdminTeams.tsx
│   │   │   └── AdminStatistics.tsx
│   │   └── user/          # User pages
│   │       ├── UserLayout.tsx
│   │       └── UserDataInput.tsx
│   ├── App.tsx
│   └── main.tsx
└── public/
```

## Cài đặt

```bash
cd frontend
npm install
```

## Chạy Development Server

```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3003

## Build cho Production

```bash
npm run build
```

Build files sẽ được tạo trong thư mục `dist/`.

## Responsive Design

- **Desktop (>768px):** Full layout với sidebar và main content
- **Tablet (480px-768px):** Responsive sidebar, mobile-friendly tables
- **Mobile (<480px):** Hamburger menu, stacked layout, full-width buttons

## Đăng nhập

### Admin
- **Username:** `admin`
- **Password:** `admin123`
- **URL:** http://localhost:3003/admin

### User
- Tạo user trong admin panel
- **URL:** http://localhost:3003/user

## Cấu hình

Frontend được cấu hình để proxy requests đến backend tại `http://localhost:3002` trong file `vite.config.ts`.

## Dependencies

- React 19
- TypeScript
- React Router DOM
- Axios
- React Icons
- Font Awesome (via CDN)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)