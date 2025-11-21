#!/bin/bash

# Script tự động deploy lên Vercel
# Usage: ./deploy-vercel-auto.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Tự động deploy lên Vercel"
echo ""
echo "📋 Thông tin project:"
echo "   Directory: ${SCRIPT_DIR}"
echo "   Repository: https://github.com/ducdo777/iuba-system"
echo ""

# Kiểm tra Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI chưa được cài đặt!"
    echo ""
    echo "🔧 Đang cài đặt Vercel CLI..."
    npm install -g vercel
    
    if [ $? -ne 0 ]; then
        echo "❌ Cài đặt Vercel CLI thất bại!"
        echo "Thử cài đặt thủ công: npm install -g vercel"
        exit 1
    fi
fi

echo "✅ Vercel CLI đã được cài đặt: $(vercel --version)"
echo ""

# Kiểm tra authentication
if ! vercel whoami &> /dev/null; then
    echo "🔐 Chưa đăng nhập Vercel"
    echo ""
    echo "Đang mở trình duyệt để đăng nhập..."
    vercel login
    
    if [ $? -ne 0 ]; then
        echo "❌ Đăng nhập thất bại!"
        exit 1
    fi
else
    echo "✅ Đã đăng nhập Vercel: $(vercel whoami)"
fi

echo ""
echo "📝 Kiểm tra git status..."
git status --short | head -5 || echo "Working tree clean"

# Kiểm tra Vercel project đã được link chưa
if [ -f ".vercel/project.json" ]; then
    echo ""
    echo "✅ Vercel project đã được link"
    PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)
    echo "   Project ID: ${PROJECT_ID}"
    echo ""
    read -p "Bạn có muốn deploy vào project hiện có không? (y/n) " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Xóa link hiện tại và tạo project mới..."
        rm -rf .vercel
    fi
fi

# Deploy preview
echo ""
echo "📦 Đang deploy preview lên Vercel..."
echo ""

vercel --yes

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Deploy preview thất bại!"
    exit 1
fi

echo ""
echo "✅ Deploy preview thành công!"
echo ""

# Lấy preview URL
PREVIEW_URL=$(vercel ls --scope=$(vercel whoami) 2>/dev/null | grep -i iuba | head -1 | awk '{print $2}' || echo "")

if [ ! -z "$PREVIEW_URL" ]; then
    echo "🔗 Preview URL: ${PREVIEW_URL}"
else
    echo "📋 Kiểm tra preview URL trong Vercel Dashboard"
fi

echo ""
read -p "Bạn có muốn deploy production không? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Đang deploy production..."
    echo ""
    
    vercel --prod --yes
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deploy production thành công!"
        echo ""
        
        # Lấy production URL
        PRODUCTION_URL=$(vercel ls --scope=$(vercel whoami) 2>/dev/null | grep -i iuba | grep production | head -1 | awk '{print $2}' || echo "")
        
        if [ ! -z "$PRODUCTION_URL" ]; then
            echo "🔗 Production URL: ${PRODUCTION_URL}"
        else
            echo "📋 Kiểm tra production URL trong Vercel Dashboard"
        fi
        
        echo ""
        echo "⚠️  LƯU Ý QUAN TRỌNG:"
        echo ""
        echo "1. Tạo Vercel Postgres Database:"
        echo "   - Vào Vercel Dashboard → Project → Storage"
        echo "   - Create Database → Postgres"
        echo "   - Copy connection string"
        echo ""
        echo "2. Set Environment Variables:"
        echo "   - POSTGRES_URL: Connection string từ Vercel Postgres"
        echo "   - JWT_SECRET: Random string (dùng: openssl rand -base64 32)"
        echo "   - NODE_ENV: production"
        echo ""
        echo "3. Redeploy sau khi set environment variables:"
        echo "   vercel --prod"
        echo ""
        echo "📚 Chi tiết: Xem file DEPLOY_VERCEL.md"
    else
        echo ""
        echo "❌ Deploy production thất bại!"
        exit 1
    fi
else
    echo ""
    echo "⏭️  Bỏ qua deploy production"
    echo "   Chạy 'vercel --prod' sau để deploy production"
fi

echo ""
echo "🎉 Hoàn thành!"
