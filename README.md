# 训练助手升级版

这是一个基于 React + Vite 的个人训练管理小程序，适配 GitHub Pages 子路径 `/training-app/`。

## 功能

- 首页 Dashboard：今日训练、体重、7日均重、本周跑量、力量次数、疲劳状态
- 训练计划：一键生成跑步 + 力量 + 恢复的 7 天计划，可勾选完成并记录 RPE
- 跑步记录：轻松跑、节奏跑、间歇跑、长距离跑、恢复跑
- 力量记录：上肢推、上肢拉、下肢、核心、全身动作库
- 身体数据：体重、体脂率、腰围、睡眠、疲劳、饥饿、饮食与蛋白质达标
- 周总结：跑量、力量次数、完成率、减脂反馈
- 设置：个人信息和训练目标

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## GitHub Pages 部署

`vite.config.js` 已设置：

```js
base: '/training-app/'
```

构建后把 `dist` 发布到 GitHub Pages 即可。

如果你用 GitHub Actions，可以新建 `.github/workflows/deploy.yml` 自动部署。
