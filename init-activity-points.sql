-- Script SQL để khởi tạo bảng activity_point_config và dữ liệu mặc định
-- Chạy script này trên PostgreSQL database

-- Tạo bảng activity_point_config
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

-- Tạo index cho activityType để tìm kiếm nhanh hơn
CREATE INDEX IF NOT EXISTS "IDX_activity_point_config_activityType" ON "activity_point_config" ("activityType");

-- Chèn dữ liệu mặc định (chỉ chèn nếu chưa tồn tại)
INSERT INTO "activity_point_config" ("id", "activityType", "activityName", "pointPerUnit", "status", "createdAt", "updatedAt")
VALUES 
    (gen_random_uuid(), 'donThuan', 'Đơn thuần', 1.00, 'active', now(), now()),
    (gen_random_uuid(), 'huuHieu', 'Hữu hiệu', 10.00, 'active', now(), now()),
    (gen_random_uuid(), 'baptem', 'Baptem', 500.00, 'active', now(), now()),
    (gen_random_uuid(), 'thoPhuong', 'Thờ phượng', 1000.00, 'active', now(), now()),
    (gen_random_uuid(), 'lapCLB', 'Lập CLB', 500.00, 'active', now(), now()),
    (gen_random_uuid(), 'lenGiaiDoan', 'Lên giai đoạn', 1000.00, 'active', now(), now()),
    (gen_random_uuid(), 'hiepCauNguyenSang', 'Nhóm Hiệp Cầu Nguyện Sáng', 10.00, 'active', now(), now())
ON CONFLICT ("activityType") DO NOTHING;

-- Kiểm tra dữ liệu đã được chèn
SELECT 
    "activityType",
    "activityName",
    "pointPerUnit",
    "status"
FROM "activity_point_config"
ORDER BY "activityName" ASC;

