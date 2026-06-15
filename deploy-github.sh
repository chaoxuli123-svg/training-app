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
# 注意：你需要先在GitHub创建仓库，然后替换下面的URL
# git remote add origin https://github.com/你的用户名/training-app.git
# git push -f origin gh-pages

echo ""
echo "✅ 构建完成！"
echo ""
echo "📋 接下来请执行以下步骤："
echo ""
echo "1. 在 GitHub 创建新仓库："
echo "   访问 https://github.com/new"
echo "   仓库名：training-app"
echo ""
echo "2. 在 dist 目录执行以下命令："
echo "   cd dist"
echo "   git remote add origin https://github.com/你的用户名/training-app.git"
echo "   git push -f origin gh-pages"
echo ""
echo "3. 在GitHub仓库设置中启用 GitHub Pages："
echo "   Settings → Pages → Source → 选择 gh-pages 分支"
echo ""
echo "4. 访问你的网站："
echo "   https://你的用户名.github.io/training-app/"
echo ""
