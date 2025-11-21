#!/bin/bash

# Script tự động deploy và chạy migration
# Usage: ./auto-migrate.sh [MIGRATION_SECRET]
#
# Nếu không cung cấp MIGRATION_SECRET, script sẽ:
# - Tạo secret tự động, hoặc
# - Dùng AUTO_MIGRATE mode (nếu set AUTO_MIGRATE=true trên Vercel)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Auto Deploy & Migrate IUBA System"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI chưa được cài đặt!${NC}"
    echo "Đang cài đặt Vercel CLI..."
    npm install -g vercel
fi

echo -e "${GREEN}✅ Vercel CLI: $(vercel --version)${NC}"

# Check authentication
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Chưa đăng nhập Vercel${NC}"
    vercel login
fi

echo -e "${GREEN}✅ Đã đăng nhập: $(vercel whoami)${NC}"
echo ""

# Get migration secret from argument, environment, or prompt
MIGRATION_SECRET_ARG="$1"

if [ -n "$MIGRATION_SECRET_ARG" ]; then
    MIGRATION_SECRET="$MIGRATION_SECRET_ARG"
elif [ -n "$MIGRATION_SECRET" ]; then
    # Already set from environment
    echo -e "${GREEN}✅ Using MIGRATION_SECRET from environment${NC}"
else
    echo -e "${YELLOW}⚠️  MIGRATION_SECRET chưa được set${NC}"
    echo "Options:"
    echo "1. Nhập MIGRATION_SECRET"
    echo "2. Enter để dùng AUTO_MIGRATE mode (cần set AUTO_MIGRATE=true trên Vercel)"
    read -s MIGRATION_SECRET_INPUT
    
    if [ -z "$MIGRATION_SECRET_INPUT" ]; then
        USE_AUTO_MIGRATE=true
        echo -e "${BLUE}📝 Sẽ dùng AUTO_MIGRATE mode${NC}"
    else
        MIGRATION_SECRET="$MIGRATION_SECRET_INPUT"
    fi
    echo ""
fi

# Deploy to Vercel
echo -e "${BLUE}📦 Đang deploy lên Vercel...${NC}"
echo ""

DEPLOY_OUTPUT=$(vercel --prod --yes 2>&1)
echo "$DEPLOY_OUTPUT"

# Extract deployment URL
DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^ ]*\.vercel\.app' | head -1)

if [ -z "$DEPLOY_URL" ]; then
    echo -e "${RED}❌ Không tìm thấy deployment URL${NC}"
    echo "Trying to get from vercel ls..."
    DEPLOY_URL=$(vercel ls --scope=$(vercel whoami) 2>/dev/null | grep -i iuba | grep production | head -1 | awk '{print $2}' || echo "")
fi

if [ -z "$DEPLOY_URL" ]; then
    echo -e "${RED}❌ Không thể xác định deployment URL${NC}"
    echo "Vui lòng chạy migration thủ công"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Deploy thành công!${NC}"
echo -e "${GREEN}📍 URL: ${DEPLOY_URL}${NC}"
echo ""

# Wait for deployment to be ready
echo -e "${BLUE}⏳ Đang chờ deployment sẵn sàng...${NC}"
sleep 5

# Check if deployment is ready
MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s -f "${DEPLOY_URL}/api/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Deployment đã sẵn sàng!${NC}"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -e "${YELLOW}⏳ Đang chờ... ($RETRY_COUNT/$MAX_RETRIES)${NC}"
    sleep 3
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}❌ Deployment chưa sẵn sàng sau ${MAX_RETRIES} lần thử${NC}"
    echo "Vui lòng chạy migration thủ công sau"
    exit 1
fi

# Run migration
echo ""
echo -e "${BLUE}🔄 Đang chạy migration...${NC}"
echo ""

MIGRATE_URL="${DEPLOY_URL}/api/migrate"

if [ "$USE_AUTO_MIGRATE" = "true" ]; then
    echo -e "${BLUE}📝 Dùng AUTO_MIGRATE mode...${NC}"
    MIGRATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$MIGRATE_URL" \
      -H "Content-Type: application/json" \
      -d '{}' 2>&1)
else
    MIGRATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$MIGRATE_URL" \
      -H "Content-Type: application/json" \
      -H "X-Migration-Secret: ${MIGRATION_SECRET}" \
      -d "{\"secret\":\"${MIGRATION_SECRET}\"}" 2>&1)
fi

HTTP_CODE=$(echo "$MIGRATE_RESPONSE" | tail -1)
RESPONSE_BODY=$(echo "$MIGRATE_RESPONSE" | sed '$d')

echo "Response Code: $HTTP_CODE"
echo "Response Body:"
echo "$RESPONSE_BODY" | jq . 2>/dev/null || echo "$RESPONSE_BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Migration thành công!${NC}"
    echo ""
    echo -e "${GREEN}📋 Thông tin đăng nhập:${NC}"
    echo -e "   Username: ${YELLOW}admin${NC}"
    echo -e "   Password: ${YELLOW}admin123${NC}"
    echo ""
    echo -e "${GREEN}🔗 Test login:${NC}"
    echo "   curl -X POST ${DEPLOY_URL}/api/auth/login \\"
    echo "     -H 'Content-Type: application/json' \\"
    echo "     -d '{\"username\":\"admin\",\"password\":\"admin123\"}'"
    echo ""
    
    # Test login
    echo -e "${BLUE}🧪 Đang test login...${NC}"
    LOGIN_RESPONSE=$(curl -s -X POST "${DEPLOY_URL}/api/auth/login" \
      -H "Content-Type: application/json" \
      -d '{"username":"admin","password":"admin123"}' 2>&1)
    
    if echo "$LOGIN_RESPONSE" | grep -q "access_token"; then
        echo -e "${GREEN}✅ Login test thành công!${NC}"
    else
        echo -e "${YELLOW}⚠️  Login test có vấn đề:${NC}"
        echo "$LOGIN_RESPONSE"
    fi
else
    echo -e "${RED}❌ Migration thất bại!${NC}"
    echo ""
    echo "Có thể do:"
    echo "1. MIGRATION_SECRET chưa được set trên Vercel"
    echo "2. Database connection chưa được cấu hình"
    echo "3. Endpoint chưa sẵn sàng"
    echo ""
    echo "Kiểm tra logs:"
    echo "   vercel logs ${DEPLOY_URL}"
    exit 1
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Hoàn thành!${NC}"
echo ""
echo -e "${GREEN}📍 Production URL: ${DEPLOY_URL}${NC}"
echo -e "${GREEN}🔐 Admin Login: admin / admin123${NC}"
echo ""
echo -e "${YELLOW}⚠️  Lưu ý:${NC}"
echo "   - Đảm bảo MIGRATION_SECRET đã được set trên Vercel Dashboard"
echo "   - Sau khi migration xong, có thể xóa MIGRATION_SECRET nếu muốn"
echo -e "${GREEN}═══════════════════════════════════════${NC}"

