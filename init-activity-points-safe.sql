-- Script SQL an toàn: Chỉ tạo bảng nếu chưa tồn tại và chỉ chèn dữ liệu mới
-- Phù hợp cho Neon, Supabase, hoặc PostgreSQL khác

-- Tạo bảng activity_point_config (nếu chưa tồn tại)
CREATE TABLE IF NOT EXISTS "activity_point_config" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "activityType" varchar NOT NULL,
    "activityName" varchar NOT NULL,
    "pointPerUnit" decimal(10,2) NOT NULL DEFAULT 0,
    "status" varchar NOT NULL DEFAULT 'active',
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now(),
    CONSTRAINT "PK_activity_point_config" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_activity_point_config_activityType" UNIQUE ("activityType")
);

-- Tạo index (nếu chưa tồn tại)
CREATE INDEX IF NOT EXISTS "IDX_activity_point_config_activityType" 
ON "activity_point_config" ("activityType");

-- Chèn dữ liệu mặc định (chỉ chèn nếu chưa tồn tại)
-- Sử dụng ON CONFLICT để tránh lỗi khi chạy lại script

-- Đơn thuần
INSERT INTO "activity_point_config" ("id", "activityType", "activityName", "pointPerUnit", "status", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'donThuan', 'Đơn thuần', 1.00, 'active', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "activity_point_config" WHERE "activityType" = 'donThuan');

-- Hữu hiệu
INSERT INTO "activity_point_config" ("id", "activityType", "activityName", "pointPerUnit", "status", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'huuHieu', 'Hữu hiệu', 10.00, 'active', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "activity_point_config" WHERE "activityType" = 'huuHieu');

-- Baptem
INSERT INTO "activity_point_config" ("id", "activityType", "activityName", "pointPerUnit", "status", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'baptem', 'Baptem', 500.00, 'active', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "activity_point_config" WHERE "activityType" = 'baptem');

-- Thờ phượng
INSERT INTO "activity_point_config" ("id", "activityType", "activityName", "pointPerUnit", "status", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'thoPhuong', 'Thờ phượng', 1000.00, 'active', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "activity_point_config" WHERE "activityType" = 'thoPhuong');

-- Lập CLB
INSERT INTO "activity_point_config" ("id", "activityType", "activityName", "pointPerUnit", "status", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'lapCLB', 'Lập CLB', 500.00, 'active', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "activity_point_config" WHERE "activityType" = 'lapCLB');

-- Lên giai đoạn
INSERT INTO "activity_point_config" ("id", "activityType", "activityName", "pointPerUnit", "status", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'lenGiaiDoan', 'Lên giai đoạn', 1000.00, 'active', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "activity_point_config" WHERE "activityType" = 'lenGiaiDoan');

-- Hiển thị kết quả
SELECT 
    "activityType" as "Loại hoạt động",
    "activityName" as "Tên",
    "pointPerUnit" as "Điểm/đơn vị",
    "status" as "Trạng thái",
    "createdAt" as "Ngày tạo"
FROM "activity_point_config"
ORDER BY "activityName" ASC;

