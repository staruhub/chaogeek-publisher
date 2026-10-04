# POCKET · 掌上时光

真实 Three.js 3D 掌机，mGBA WASM 运行用户本地 .gba 卡带。无账户、无游戏文件上传、无商业 ROM 或 Nintendo BIOS。

## 开发

Node >=22.12。`npm install --ignore-scripts`，`npm run build`，`npm run preview`。默认静态 base 为 `/chaogeek-publisher/pocket-gba/`；单独部署修改 vite build --base 为 `/`。支持 Vercel 静态部署，输出 `dist`。

`npm run test` 运行 Chromium 真浏览器回归，验证真实 ARM GBA 测试卡的角色移动、存档恢复、卡带退换、触屏及响应式布局。QA 图片及机器可读结果位于 qa/。

## 发布

源代码在 pocket-gba 分支的 `.pocket-gba-src/`。专用 workflow 构建并验证后，只将输出写入 `pocket-gba/`，不覆盖根目录原有排版工具。只有测试通过且发布分支快进到构建完成的提交后，GitHub Pages 才发布该版本。源代码未通过测试不能声称已上线。

## 边界

原创测试 ROM 仅用于验证模拟器，并非马里奥。商业游戏由用户自行提供有权使用的本地文件；本项目不声称某款游戏已经全流程通关测试。模拟器首次加载、网站首访需要联网。存档以 ROM SHA-256 隔离，浏览器数据清除会丢失本地存档，建议导出 .pocket 备份。MPL-2.0 核心不作修改，来源见发布目录 THIRD_PARTY_NOTICES.txt。
