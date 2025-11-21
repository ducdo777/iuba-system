#!/bin/bash

# Script để setup environment variables trên Vercel
# Usage: ./setup-vercel-env.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔧 Setup Environment Variables trên Vercel"
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

# Kiểm tra JWT_SECRET đã set chưa
if vercel env ls JWT_SECRET &> /dev/null; then
    echo "⚠️  JWT_SECRET đã tồn tại"
    read -p "Bạn có muốn thay thế không? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Generate JWT_SECRET
        JWT_SECRET=$(openssl rand -base64 32)
        echo "🔑 Generated JWT_SECRET: ${JWT_SECRET}"
        echo ""
        
        # Set environment variables
        echo "📝 Đang set JWT_SECRET..."
        echo "$JWT_SECRET" | vercel env add JWT_SECRET production
        
        if [ $? -eq 0 ]; then
            echo "✅ Đã set JWT_SECRET cho production"
        fi
        
        echo "$JWT_SECRET" | vercel env add JWT_SECRET preview
        if [ $? -eq 0 ]; then
            echo "✅ Đã set JWT_SECRET cho preview"
        fi
    fi
else
    # Generate JWT_SECRET
    JWT_SECRET=$(openssl rand -base64 32)
    echo "🔑 Generated JWT_SECRET: ${JWT_SECRET}"
    echo ""
    
    # Set environment variables
    echo "📝 Đang set JWT_SECRET..."
    echo "$JWT_SECRET" | vercel env add JWT_SECRET production
    echo "$JWT_SECRET" | vercel env add JWT_SECRET preview
    echo "✅ Đã set JWT_SECRET"
fi

echo ""
echo "📝 Set NODE_ENV=production..."
echo "production" | vercel env add NODE_ENV production
echo "production" | vercel env add NODE_ENV preview

echo ""
echo "⚠️  QUAN TRỌNG: POSTGRES_URL"
echo ""
echo "Bạn cần tạo Vercel Postgres Database và set POSTGRES_URL:"
echo ""
echo "1. Vào Vercel Dashboard → Project → Storage"
echo "2. Create Database → Postgres"
echo "3. Copy connection string"
echo "4. Chạy lệnh sau (thay YOUR_POSTGRES_URL):"
echo "   echo 'YOUR_POSTGRES_URL' | vercel env add POSTGRES_URL production"
echo "   echo 'YOUR_POSTGRES_URL' | vercel env add POSTGRES_URL preview"
echo ""
echo "Hoặc set trong Vercel Dashboard:"
echo "   Settings → Environment Variables"
echo ""

echo "✅ Hoàn thành setup environment variables!"
echo ""
echo "📋 Environment variables hiện tại:"
vercel env ls
