#!/bin/bash

# Script tự động chạy migration sau khi deploy
# Usage: ./run-auto-migrate.sh [DEPLOY_URL] [MIGRATION_SECRET]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

DEPLOY_URL="$1"
MIGRATION_SECRET="$2"

# Get deploy URL if not provided
if [ -z "$DEPLOY_URL" ]; then
    echo -e "${BLUE}📋 Lấy deployment URL từ Vercel...${NC}"
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${RED}❌ Vercel CLI chưa được cài đặt!${NC}"
        exit 1
    fi
    
    DEPLOY_URL=$(vercel ls --scope=$(vercel whoami) 2>/dev/null | grep -i iuba | grep production | head -1 | awk '{print $2}' || echo "")
    
    if [ -z "$DEPLOY_URL" ]; then
        echo -e "${RED}❌ Không tìm thấy deployment URL${NC}"
        echo "Vui lòng cung cấp URL: ./run-auto-migrate.sh https://your-domain.vercel.app"
        exit 1
    fi
fi

# Get migration secret if not provided
if [ -z "$MIGRATION_SECRET" ]; then
    if [ -n "$MIGRATION_SECRET" ]; then
        MIGRATION_SECRET="$MIGRATION_SECRET"
    else
        echo -e "${YELLOW}⚠️  MIGRATION_SECRET chưa được set${NC}"
        echo "Nhập MIGRATION_SECRET (hoặc Enter để dùng AUTO_MIGRATE):"
        read -s MIGRATION_SECRET_INPUT
        
        if [ -z "$MIGRATION_SECRET_INPUT" ]; then
            echo -e "${BLUE}📝 Sẽ dùng AUTO_MIGRATE mode${NC}"
            USE_AUTO_MIGRATE=true
        else
            MIGRATION_SECRET="$MIGRATION_SECRET_INPUT"
        fi
    fi
fi

echo ""
echo -e "${BLUE}🔄 Đang chạy migration...${NC}"
echo -e "${BLUE}📍 URL: ${DEPLOY_URL}${NC}"
echo ""

# Wait for deployment to be ready
echo -e "${BLUE}⏳ Đang chờ deployment sẵn sàng...${NC}"
MAX_RETRIES=15
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s -f "${DEPLOY_URL}/api/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Deployment đã sẵn sàng!${NC}"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -e "${YELLOW}⏳ Đang chờ... ($RETRY_COUNT/$MAX_RETRIES)${NC}"
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}❌ Deployment chưa sẵn sàng sau ${MAX_RETRIES} lần thử${NC}"
    exit 1
fi

# Run migration
MIGRATE_URL="${DEPLOY_URL}/api/migrate"

if [ "$USE_AUTO_MIGRATE" = "true" ]; then
    echo -e "${BLUE}🔄 Chạy migration với AUTO_MIGRATE mode...${NC}"
    MIGRATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$MIGRATE_URL" \
      -H "Content-Type: application/json" \
      -d '{}' 2>&1)
else
    echo -e "${BLUE}🔄 Chạy migration với secret key...${NC}"
    MIGRATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$MIGRATE_URL" \
      -H "Content-Type: application/json" \
      -H "X-Migration-Secret: ${MIGRATION_SECRET}" \
      -d "{\"secret\":\"${MIGRATION_SECRET}\"}" 2>&1)
fi

HTTP_CODE=$(echo "$MIGRATE_RESPONSE" | tail -1)
RESPONSE_BODY=$(echo "$MIGRATE_RESPONSE" | sed '$d')

echo ""
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
    
    # Test login
    echo -e "${BLUE}🧪 Đang test login...${NC}"
    LOGIN_RESPONSE=$(curl -s -X POST "${DEPLOY_URL}/api/auth/login" \
      -H "Content-Type: application/json" \
      -d '{"username":"admin","password":"admin123"}' 2>&1)
    
    if echo "$LOGIN_RESPONSE" | grep -q "access_token"; then
        echo -e "${GREEN}✅ Login test thành công!${NC}"
        echo ""
        echo -e "${GREEN}🎉 Hoàn thành! Bạn có thể login tại: ${DEPLOY_URL}${NC}"
    else
        echo -e "${YELLOW}⚠️  Login test có vấn đề:${NC}"
        echo "$LOGIN_RESPONSE" | jq . 2>/dev/null || echo "$LOGIN_RESPONSE"
    fi
else
    echo -e "${RED}❌ Migration thất bại!${NC}"
    echo ""
    echo "Có thể do:"
    echo "1. MIGRATION_SECRET chưa được set trên Vercel"
    echo "2. Database connection chưa được cấu hình"
    echo "3. Endpoint chưa sẵn sàng"
    exit 1
fi

