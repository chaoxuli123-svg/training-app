#!/bin/bash

# GitHub Pages 部署脚本
# 使用方法：bash deploy-github.sh

echo "🚀 开始部署到 GitHub Pages..."

# 1. 构建项目
echo "📦 构建项目..."
npm run build

# 2. 进入构建目录
cd dist

# 3. 初始化git（如果还没有）
if [ ! -d .git ]; then
  git init
  git checkout -b gh-pages
fi

# 4. 添加所有文件
git add -A

# 5. 提交
git commit -m "Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"

# 6. 推送到GitHub Pages
echo "🚀 推送到 GitHub Pages..."

# 检查是否已经添加了远程仓库
if git remote | grep -q origin; then
  git remote remove origin
fi

git remote add origin https://github.com/chaoxuli123-svg/training-app.git
git push -f origin gh-pages

cd ..

echo ""
echo "✅ 部署完成！"
echo ""
echo "📋 接下来的步骤："
echo ""
echo "1. 在GitHub仓库设置中启用 GitHub Pages："
echo "   访问: https://github.com/chaoxuli123-svg/training-app/settings/pages"
echo "   Source → 选择 gh-pages 分支 → 保存"
echo ""
echo "2. 等待几分钟后访问你的网站："
echo "   https://chaoxuli123-svg.github.io/training-app/"
echo ""
