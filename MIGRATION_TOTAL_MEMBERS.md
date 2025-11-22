# Migration: Thêm trường totalMembers vào bảng teams

## Mô tả
Thêm trường `totalMembers` vào bảng `teams` để lưu trữ số lượng thành viên của mỗi team.

## Các thay đổi

### 1. Database Schema
- Thêm cột `totalMembers` (INTEGER, DEFAULT 0) vào bảng `teams`

### 2. Entity Updates
- `src/teams/entities/team.entity.ts`: Thêm trường `totalMembers`

### 3. Service Updates
- `src/users/users.service.ts`: Tự động cập nhật `totalMembers` khi:
  - Tạo user mới
  - Cập nhật teamId của user
  - Xóa user
- `src/teams/teams.service.ts`: Khởi tạo `totalMembers = 0` khi tạo team mới
- `src/statistics/statistics.service.ts`: Sử dụng `totalMembers` từ database

## Cách chạy Migration

### Option 1: Sử dụng SQL Script (Khuyên dùng)

1. **Kết nối đến database PostgreSQL:**
   ```bash
   psql $POSTGRES_URL
   ```

2. **Chạy SQL script:**
   ```sql
   \i add-total-members-column.sql
   ```

   Hoặc copy và paste nội dung từ file `add-total-members-column.sql`

### Option 2: Sử dụng TypeORM Synchronize

Nếu `synchronize: true` được bật trong `app.module.ts`, TypeORM sẽ tự động tạo cột khi ứng dụng khởi động.

**Lưu ý:** Chỉ dùng trong development, không dùng trong production.

### Option 3: Chạy qua API Migration Endpoint

1. **Set environment variable:**
   ```
   MIGRATION_SECRET=your-secret-key
   ```

2. **Call API:**
   ```bash
   curl -X POST https://your-domain.vercel.app/api/migrate \
     -H "Content-Type: application/json" \
     -H "X-Migration-Secret: your-secret-key" \
     -d '{"secret":"your-secret-key"}'
   ```

## SQL Script

File: `add-total-members-column.sql`

```sql
-- Add totalMembers column
ALTER TABLE "teams" 
ADD COLUMN IF NOT EXISTS "totalMembers" INTEGER DEFAULT 0;

-- Update existing teams with current member counts
UPDATE "teams" t
SET "totalMembers" = (
  SELECT COUNT(*) 
  FROM "users" u 
  WHERE u."teamId" = t.id 
  AND u."status" = 'active'
);
```

## Verification

Sau khi chạy migration, kiểm tra:

1. **Kiểm tra cột đã được thêm:**
   ```sql
   SELECT column_name, data_type, column_default 
   FROM information_schema.columns 
   WHERE table_name = 'teams' AND column_name = 'totalMembers';
   ```

2. **Kiểm tra dữ liệu:**
   ```sql
   SELECT id, "teamName", "totalMembers" 
   FROM teams;
   ```

3. **Test tự động cập nhật:**
   - Tạo user mới với teamId → `totalMembers` sẽ tự động tăng
   - Xóa user → `totalMembers` sẽ tự động giảm
   - Cập nhật teamId của user → `totalMembers` của cả 2 teams sẽ được cập nhật

## Rollback (nếu cần)

```sql
ALTER TABLE "teams" DROP COLUMN IF EXISTS "totalMembers";
```

