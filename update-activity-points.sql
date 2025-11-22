-- Script SQL để cập nhật thông số tính điểm
-- Chạy script này để cập nhật các giá trị hiện có trong database

-- Cập nhật điểm cho từng loại hoạt động
UPDATE "activity_point_config"
SET 
    "pointPerUnit" = 1.00,
    "updatedAt" = now()
WHERE "activityType" = 'donThuan';

UPDATE "activity_point_config"
SET 
    "pointPerUnit" = 10.00,
    "updatedAt" = now()
WHERE "activityType" = 'huuHieu';

UPDATE "activity_point_config"
SET 
    "pointPerUnit" = 500.00,
    "updatedAt" = now()
WHERE "activityType" = 'baptem';

UPDATE "activity_point_config"
SET 
    "pointPerUnit" = 1000.00,
    "updatedAt" = now()
WHERE "activityType" = 'thoPhuong';

UPDATE "activity_point_config"
SET 
    "pointPerUnit" = 500.00,
    "updatedAt" = now()
WHERE "activityType" = 'lapCLB';

UPDATE "activity_point_config"
SET 
    "pointPerUnit" = 1000.00,
    "updatedAt" = now()
WHERE "activityType" = 'lenGiaiDoan';

-- Hiển thị kết quả sau khi cập nhật
SELECT 
    "activityType" as "Loại hoạt động",
    "activityName" as "Tên",
    "pointPerUnit" as "Điểm/đơn vị",
    "status" as "Trạng thái",
    "updatedAt" as "Ngày cập nhật"
FROM "activity_point_config"
ORDER BY "activityName" ASC;

