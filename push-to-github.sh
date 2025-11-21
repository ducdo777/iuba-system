#!/bin/bash

# Script để push code lên GitHub Private Repository
# Usage: ./push-to-github.sh YOUR_USERNAME REPO_NAME

echo "🚀 Push IUBA System lên GitHub Private Repository"
echo ""

# Kiểm tra arguments
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "❌ Thiếu thông tin!"
    echo ""
    echo "Usage: ./push-to-github.sh YOUR_USERNAME REPO_NAME"
    echo "Example: ./push-to-github.sh hoangminh iuba-system"
    echo ""
    exit 1
fi

USERNAME=$1
REPO_NAME=$2
REPO_URL="https://github.com/${USERNAME}/${REPO_NAME}.git"

echo "📋 Thông tin Repository:"
echo "   Username: ${USERNAME}"
echo "   Repo Name: ${REPO_NAME}"
echo "   URL: ${REPO_URL}"
echo ""

# Kiểm tra git status
echo "📝 Kiểm tra git status..."
git status --short

# Hỏi xác nhận
echo ""
read -p "Bạn đã tạo repository trên GitHub chưa? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Vui lòng tạo repository trên GitHub trước!"
    echo ""
    echo "Các bước:"
    echo "1. Vào https://github.com"
    echo "2. Click '+' → New repository"
    echo "3. Đặt tên: ${REPO_NAME}"
    echo "4. Chọn Private"
    echo "5. Không chọn 'Initialize with README'"
    echo "6. Click Create repository"
    echo ""
    exit 1
fi

# Kiểm tra remote đã tồn tại chưa
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Remote 'origin' đã tồn tại!"
    echo "   URL hiện tại: $(git remote get-url origin)"
    echo ""
    read -p "Bạn có muốn thay thế bằng URL mới không? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        echo "✅ Đã xóa remote cũ"
    else
        echo "❌ Hủy bỏ"
        exit 1
    fi
fi

# Thêm remote
echo "🔗 Thêm remote repository..."
git remote add origin ${REPO_URL}

# Đổi tên branch thành main (nếu cần)
echo "🌿 Đổi tên branch thành main..."
git branch -M main 2>/dev/null || echo "Branch đã là main"

# Push lên GitHub
echo ""
echo "⬆️  Pushing code lên GitHub..."
echo ""
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Đã push thành công lên GitHub!"
    echo ""
    echo "📦 Repository URL: ${REPO_URL}"
    echo ""
    echo "🎉 Hoàn thành!"
else
    echo ""
    echo "❌ Lỗi khi push!"
    echo ""
    echo "Có thể do:"
    echo "- Repository chưa được tạo trên GitHub"
    echo "- Sai username hoặc repo name"
    echo "- Chưa authenticate (dùng Personal Access Token)"
    echo ""
    echo "Xem file GITHUB_DEPLOY.md để biết thêm chi tiết"
fi
