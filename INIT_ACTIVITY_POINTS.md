# 📋 Hướng dẫn khởi tạo Activity Point Config

## Script SQL

Có 2 file SQL để khởi tạo:

1. **`init-activity-points.sql`** - Script đơn giản với ON CONFLICT
2. **`init-activity-points-safe.sql`** - Script an toàn hơn, phù hợp cho mọi database

## Cách chạy

### Option 1: Dùng psql (Command Line)

```bash
# Kết nối đến database
psql "postgresql://user:password@host:port/database?sslmode=require"

# Chạy script
\i init-activity-points-safe.sql
```

Hoặc:

```bash
psql "postgresql://user:password@host:port/database?sslmode=require" < init-activity-points-safe.sql
```

### Option 2: Dùng Neon Console

1. Vào Neon Dashboard
2. Chọn project → SQL Editor
3. Copy nội dung file `init-activity-points-safe.sql`
4. Paste vào SQL Editor
5. Click "Run"

### Option 3: Dùng Supabase

1. Vào Supabase Dashboard
2. Chọn project → SQL Editor
3. Copy nội dung file `init-activity-points-safe.sql`
4. Paste vào SQL Editor
5. Click "Run"

### Option 4: Dùng pgAdmin hoặc DBeaver

1. Kết nối đến database
2. Mở Query Tool / SQL Editor
3. Copy nội dung file `init-activity-points-safe.sql`
4. Paste và chạy

## Dữ liệu mặc định

Script sẽ tạo 6 cấu hình điểm:

| Loại hoạt động | Tên | Điểm/đơn vị |
|---------------|-----|-------------|
| donThuan | Đơn thuần | 1.00 |
| huuHieu | Hữu hiệu | 2.00 |
| baptem | Baptem | 5.00 |
| thoPhuong | Thờ phượng | 3.00 |
| lapCLB | Lập CLB | 10.00 |
| lenGiaiDoan | Lên giai đoạn | 15.00 |

## Kiểm tra

Sau khi chạy script, kiểm tra bằng:

```sql
SELECT * FROM "activity_point_config" ORDER BY "activityName" ASC;
```

Bạn sẽ thấy 6 dòng dữ liệu.

## Lưu ý

- Script an toàn, có thể chạy nhiều lần mà không bị lỗi
- Nếu dữ liệu đã tồn tại, script sẽ bỏ qua (không ghi đè)
- Để cập nhật điểm số, dùng giao diện admin hoặc SQL:

```sql
UPDATE "activity_point_config" 
SET "pointPerUnit" = 2.00 
WHERE "activityType" = 'donThuan';
```

