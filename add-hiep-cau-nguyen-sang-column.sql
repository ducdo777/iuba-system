-- Script SQL để thêm cột "hiepCauNguyenSang" vào bảng activity_data
-- và thêm cấu hình điểm cho "Nhóm Hiệp Cầu Nguyện Sáng"

-- Thêm cột mới vào bảng activity_data
ALTER TABLE "activity_data" 
ADD COLUMN IF NOT EXISTS "hiepCauNguyenSang" integer NOT NULL DEFAULT 0;

-- Thêm cấu hình điểm vào activity_point_config
INSERT INTO "activity_point_config" ("id", "activityType", "activityName", "pointPerUnit", "status", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'hiepCauNguyenSang', 'Nhóm Hiệp Cầu Nguyện Sáng', 10.00, 'active', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "activity_point_config" WHERE "activityType" = 'hiepCauNguyenSang');

-- Kiểm tra kết quả
SELECT 
    "activityType" as "Loại hoạt động",
    "activityName" as "Tên",
    "pointPerUnit" as "Điểm/đơn vị",
    "status" as "Trạng thái"
FROM "activity_point_config"
WHERE "activityType" = 'hiepCauNguyenSang';

