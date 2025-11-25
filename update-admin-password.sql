-- Cập nhật mật khẩu cho tài khoản admin
-- Mật khẩu mới: animo2025@
-- Hash được tạo bằng bcrypt với salt rounds = 10

UPDATE users 
SET password = '$2a$10$8zZ83eIHBQFQ55gHAothCeOHA1veq5t1eCFGkveINHwQwC1PgdBuq' 
WHERE username = 'admin';

-- Kiểm tra kết quả
SELECT username, fullName, role, status 
FROM users 
WHERE username = 'admin';


