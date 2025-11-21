#!/bin/bash

# Script tự động kết nối GitHub và push code
# Usage: ./setup-github-auto.sh [REPO_NAME]

set -e

REPO_NAME=${1:-"iuba-system"}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Tự động kết nối GitHub và push code"
echo ""
echo "📋 Thông tin:"
echo "   Repository name: ${REPO_NAME}"
echo "   Directory: ${SCRIPT_DIR}"
echo ""

# Kiểm tra GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) chưa được cài đặt!"
    echo ""
    echo "🔧 Cài đặt GitHub CLI:"
    echo "   macOS: brew install gh"
    echo "   Linux: Xem https://cli.github.com/manual/installation"
    echo ""
    echo "Sau khi cài đặt, chạy lại script này."
    exit 1
fi

echo "✅ GitHub CLI đã được cài đặt: $(gh --version | head -1)"
echo ""

# Kiểm tra authentication
if ! gh auth status &> /dev/null; then
    echo "🔐 Chưa đăng nhập GitHub CLI"
    echo ""
    echo "Đang mở trình duyệt để đăng nhập..."
    gh auth login
    
    if [ $? -ne 0 ]; then
        echo "❌ Đăng nhập thất bại!"
        exit 1
    fi
else
    echo "✅ Đã đăng nhập GitHub CLI"
    gh auth status
fi

echo ""
echo "📝 Kiểm tra git status..."
git status --short | head -10

# Hỏi xác nhận
echo ""
read -p "Bạn có muốn tạo repository mới trên GitHub không? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Hủy bỏ"
    exit 1
fi

# Lấy GitHub username
GITHUB_USER=$(gh api user -q .login)
echo ""
echo "👤 GitHub username: ${GITHUB_USER}"
echo ""

# Kiểm tra repository đã tồn tại chưa
if gh repo view "${GITHUB_USER}/${REPO_NAME}" &> /dev/null; then
    echo "⚠️  Repository ${GITHUB_USER}/${REPO_NAME} đã tồn tại!"
    echo ""
    read -p "Bạn có muốn push code vào repository hiện có không? (y/n) " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Hủy bỏ"
        exit 1
    fi
else
    # Tạo repository mới
    echo "📦 Đang tạo repository mới trên GitHub..."
    echo "   Name: ${REPO_NAME}"
    echo "   Visibility: Private"
    echo ""
    
    gh repo create "${REPO_NAME}" \
        --private \
        --description "Hệ thống quản lý IUBA với React frontend và NestJS backend" \
        --source=. \
        --remote=origin \
        --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Đã tạo repository và push code thành công!"
        echo ""
        echo "🔗 Repository URL: https://github.com/${GITHUB_USER}/${REPO_NAME}"
        exit 0
    else
        echo ""
        echo "❌ Lỗi khi tạo repository!"
        echo ""
        echo "Thử cách thủ công:"
        echo "  1. Tạo repository trên GitHub: https://github.com/new"
        echo "  2. Chạy: git remote add origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
        echo "  3. Chạy: git push -u origin main"
        exit 1
    fi
fi

# Nếu repository đã tồn tại, thêm remote và push
echo "🔗 Đang kết nối với repository hiện có..."
echo ""

# Kiểm tra remote đã tồn tại chưa
if git remote get-url origin &> /dev/null; then
    CURRENT_URL=$(git remote get-url origin)
    echo "⚠️  Remote 'origin' đã tồn tại: ${CURRENT_URL}"
    echo ""
    read -p "Bạn có muốn thay thế bằng GitHub URL không? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        echo "✅ Đã xóa remote cũ"
    else
        echo "❌ Giữ nguyên remote hiện tại"
        exit 1
    fi
fi

# Thêm remote
echo "➕ Thêm remote repository..."
git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

# Đổi tên branch thành main (nếu cần)
echo "🌿 Đổi tên branch thành main..."
git branch -M main 2>/dev/null || echo "Branch đã là main"

# Push code
echo ""
echo "⬆️  Đang push code lên GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Đã push code thành công!"
    echo ""
    echo "🔗 Repository URL: https://github.com/${GITHUB_USER}/${REPO_NAME}"
    echo ""
    echo "🎉 Hoàn thành!"
else
    echo ""
    echo "❌ Lỗi khi push code!"
    exit 1
fi

