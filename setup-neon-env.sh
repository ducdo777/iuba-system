#!/bin/bash

# Script để setup Neon Postgres environment variables trên Vercel
# Usage: ./setup-neon-env.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔧 Setup Neon Postgres Environment Variables trên Vercel"
echo ""

# Kiểm tra Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI chưa được cài đặt!"
    echo "Cài đặt: npm install -g vercel"
    exit 1
fi

# Kiểm tra đã link project chưa
if [ ! -f ".vercel/project.json" ]; then
    echo "❌ Vercel project chưa được link!"
    echo "Chạy 'vercel' trước để link project"
    exit 1
fi

echo "✅ Vercel project đã được link"
echo ""

# Neon Postgres Connection String
NEON_POSTGRES_URL="postgresql://neondb_owner:npg_S7jZJufYV1Xn@ep-purple-glitter-a1p12ihz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

echo "📝 Đang set POSTGRES_URL (Neon Postgres)..."
echo "$NEON_POSTGRES_URL" | vercel env add POSTGRES_URL production
echo "$NEON_POSTGRES_URL" | vercel env add POSTGRES_URL preview
echo "✅ Đã set POSTGRES_URL"

echo ""
echo "📝 Đang set DATABASE_URL (Neon Postgres)..."
echo "$NEON_POSTGRES_URL" | vercel env add DATABASE_URL production
echo "$NEON_POSTGRES_URL" | vercel env add DATABASE_URL preview
echo "✅ Đã set DATABASE_URL"

echo ""
echo "📝 Đang set JWT_SECRET..."
JWT_SECRET=$(openssl rand -base64 32)
echo "$JWT_SECRET" | vercel env add JWT_SECRET production
echo "$JWT_SECRET" | vercel env add JWT_SECRET preview
echo "✅ Đã set JWT_SECRET: ${JWT_SECRET:0:20}..."

echo ""
echo "📝 Đang set NODE_ENV..."
echo "production" | vercel env add NODE_ENV production
echo "production" | vercel env add NODE_ENV preview
echo "✅ Đã set NODE_ENV"

echo ""
echo "✅ Hoàn thành setup environment variables!"
echo ""
echo "📋 Environment variables đã được set:"
vercel env ls

echo ""
echo "🚀 Đang redeploy với environment variables mới..."
vercel --prod --yes

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Redeploy thành công!"
    echo ""
    echo "🔗 Production URL:"
    vercel ls | grep -i iuba | grep production | head -1 | awk '{print $2}'
    echo ""
    echo "🎉 Hoàn thành setup!"
else
    echo ""
    echo "❌ Redeploy thất bại!"
    echo "Chạy 'vercel --prod' để redeploy thủ công"
fi
