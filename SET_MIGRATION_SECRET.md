# 🔐 Set MIGRATION_SECRET

## Generated Secret Key

```
MIGRATION_SECRET=vdijcJGuwA+mcHZqBJgcpKWDURAbr41RwIpYIaKLvpE=
```

## Cách Set trên Vercel Dashboard

### Bước 1: Vào Vercel Dashboard
1. Truy cập: https://vercel.com/dashboard
2. Chọn project: **iuba-system**
3. Vào **Settings** → **Environment Variables**

### Bước 2: Thêm Variable
1. Click **Add New**
2. **Key**: `MIGRATION_SECRET`
3. **Value**: `vdijcJGuwA+mcHZqBJgcpKWDURAbr41RwIpYIaKLvpE=`
4. **Environment**: Chọn **Production** (hoặc All)
5. Click **Save**

### Bước 3: Redeploy
Sau khi set variable, cần redeploy để áp dụng:

**Cách A: Từ Dashboard**
- Deployments → Click latest → "..." → **Redeploy**

**Cách B: Từ CLI**
```bash
vercel --prod
```

## Chạy Migration Sau Khi Set Secret

Sau khi set `MIGRATION_SECRET` và redeploy:

```bash
# Lấy production URL
PROD_URL=$(vercel ls --scope=$(vercel whoami) | grep -i iuba | grep production | head -1 | awk '{print $2}')

# Chạy migration
./run-auto-migrate.sh "$PROD_URL" "vdijcJGuwA+mcHZqBJgcpKWDURAbr41RwIpYIaKLvpE="
```

Hoặc dùng script tự động:
```bash
./auto-migrate.sh vdijcJGuwA+mcHZqBJgcpKWDURAbr41RwIpYIaKLvpE=
```

## Alternative: Dùng AUTO_MIGRATE

Nếu không muốn dùng secret key, có thể set:

```
AUTO_MIGRATE=true
```

Sau đó chạy:
```bash
./auto-migrate.sh
```

## Security Note

- **MIGRATION_SECRET**: Bảo mật hơn, cần secret key để chạy migration
- **AUTO_MIGRATE**: Dễ dàng hơn, nhưng không cần authentication
- Khuyên dùng **MIGRATION_SECRET** cho production

