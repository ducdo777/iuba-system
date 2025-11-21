# Hệ Thống IUBA với SQLite

Hệ thống quản lý IUBA với SQLite database, có trang admin riêng và trang user riêng.

## Tính năng

### Trang Admin (admin.html)
- ✅ Quản lý tài khoản (User/Admin)
- ✅ Quản lý Team IUBA
- ✅ Thống kê kết quả theo Team và User
- ✅ Dashboard tổng quan

### Trang User (user.html)
- ✅ Nhập dữ liệu hoạt động:
  - Đơn thuần
  - Hữu hiệu
  - Baptem
  - Thờ phượng
  - Laxaro
- ✅ Xem thống kê của Team mình
- ✅ Sửa/Xóa dữ liệu của mình

## Yêu cầu

- Node.js (v18 trở lên)
- npm hoặc yarn

## Cài đặt

1. Cài đặt dependencies:
```bash
cd iuba-system
npm install
```

2. Khởi động server:
```bash
npm run start:dev
```

3. Truy cập:
   - **Trang Admin:** http://localhost:3002/admin.html
   - **Trang User:** http://localhost:3002/user.html

## Đăng nhập mặc định

### Admin
- **Username:** `admin`
- **Password:** `admin123`

Admin user sẽ được tự động tạo khi server khởi động lần đầu.

## Database

Hệ thống sử dụng SQLite, database file `iuba.db` sẽ được tạo tự động trong thư mục gốc dự án.

## Cấu trúc

```
iuba-system/
├── src/
│   ├── users/              # Module quản lý tài khoản
│   ├── teams/              # Module quản lý team
│   ├── activity-data/      # Module quản lý dữ liệu hoạt động
│   ├── statistics/         # Module thống kê
│   └── auth/               # Module xác thực
├── public/
│   ├── admin.html          # Trang admin
│   ├── user.html           # Trang user
│   ├── admin.js            # JavaScript cho admin
│   ├── user.js             # JavaScript cho user
│   └── styles.css          # CSS chung
└── iuba.db                 # SQLite database (tự động tạo)
```

## Sử dụng

### 1. Tạo Team và User (Admin)

1. Đăng nhập vào trang admin
2. Vào "Quản lý Team" → Tạo team mới
3. Vào "Quản lý Tài khoản" → Tạo user mới và gán vào team

### 2. Nhập dữ liệu (User)

1. Đăng nhập vào trang user
2. Click "Thêm dữ liệu"
3. Nhập các giá trị: Đơn thuần, Hữu hiệu, Baptem, Thờ phượng, Laxaro
4. Chọn ngày và lưu

### 3. Xem thống kê (Admin)

1. Vào "Thống kê"
2. Chọn khoảng thời gian (tùy chọn)
3. Chọn Team cụ thể hoặc "Tất cả Teams"
4. Xem bảng thống kê chi tiết

## API Endpoints

### Auth
- `POST /api/auth/login` - Đăng nhập

### Users (Admin only)
- `GET /api/users` - Lấy danh sách users
- `POST /api/users` - Tạo user mới
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user

### Teams (Admin only)
- `GET /api/teams` - Lấy danh sách teams
- `POST /api/teams` - Tạo team mới
- `PUT /api/teams/:id` - Cập nhật team
- `DELETE /api/teams/:id` - Xóa team

### Activity Data
- `GET /api/activity-data` - Lấy dữ liệu (user chỉ thấy team của mình)
- `POST /api/activity-data` - Tạo dữ liệu mới
- `PUT /api/activity-data/:id` - Cập nhật (user chỉ sửa được của mình)
- `DELETE /api/activity-data/:id` - Xóa (user chỉ xóa được của mình)

### Statistics
- `GET /api/statistics/overview` - Tổng quan (Admin only)
- `GET /api/statistics/by-team` - Theo team (Admin only)
- `GET /api/statistics/my-team` - Thống kê team của user (User)

## License

UNLICENSED
