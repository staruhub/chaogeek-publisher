# POCKET · 掌上时光

公开地址：https://staruhub.github.io/chaogeek-publisher/pocket-gba/

Three.js 3D 掌机 + mGBA WASM。用户的 .gba 文件只在浏览器本地读取，不上传；无账号、无商业 ROM 或任天堂 BIOS。

## 使用

先点「试用原创测试卡」，再点「插入并开机」。方向键移动，X 跳跃，Enter 重新开始测试。手机使用触控按钮。

原版游戏由用户导入有权使用的 .gba 文件。赏玩视角可以旋转机身、查看背面；查看卡带可以单独旋转。游戏视角锁定镜头，实际游戏画面映射到 3D 屏幕。

「保存进度」写入独立的手动槽，「恢复进度」优先读取手动槽。自动保存与退卡检查点不会覆盖手动槽；重新插卡会恢复最近检查点。存档按 ROM SHA-256 隔离，重要进度请导出 .pocket 文件。

## 构建

需要 Node >=22.12、Clang 和 LLD。测试卡由 demo-src 中的原创 C/ARM 源码编译，LLD 直接输出二进制，不需要 llvm-objcopy。

在本目录执行 `npm ci --ignore-scripts`、`npm run build`、`npm run preview`。输出为 dist，默认 base 是 `/chaogeek-publisher/pocket-gba/`。独立部署需同时调整 package.json 的 build 和 preview base，并相应修改测试入口。

成品是静态站点。部署已构建的 dist 不需要服务器安装编译器，也不需要运行 Node 后端。

## 验证与发布

安装 Chromium 测试浏览器后，启动 preview 并运行 `npm test`。当前回归包含 13 项检查：实际 WebGL 场景、背面和独立卡带视角、原生 ARM 测试卡运行、键盘控制、手动槽与自动检查点隔离、状态恢复、暂停与继续、退卡重插、存档导出、无效文件拒绝、静音与暂停按钮，以及手机尺寸与真实触摸输入。

同一套 Playwright Chromium 测试同时用于本地预览和无登录的公网 URL。云端使用软件图形渲染，测试等待真实帧缓冲变化，不用固定按键时长推断功能是否成功。测试帧率不代表手机或电脑的硬件加速性能。

源代码在 pocket-gba 分支的 .pocket-gba-src。工作流通过构建和测试后，仅更新 pocket-gba/ 成品目录，不修改原有公众号排版工具。发布到 gh-pages 后，另一个任务验证公网版本指纹，再重跑浏览器测试。测试截图与结果保留在 Actions artifacts，不混入站点。

本次公网验证记录：https://github.com/staruhub/chaogeek-publisher/actions/runs/37183335701

## 范围与限制

原创测试卡不是马里奥。尚未使用商业 ROM 做具体马里奥版本的全流程通关验证，也未做 Safari/iPhone 真机、实体手柄、所有屏幕尺寸或长期性能验证。首版不包含联机和特殊外设。

首次加载需要联网。清理浏览器数据、退出无痕会话或更换设备会影响本地存档；重新打开网页需要重新选择游戏文件。源码和依赖来源见成品目录的 THIRD_PARTY_NOTICES.txt。Three.js 使用 MIT，未修改的 mGBA 核心与 SDK 使用 MPL-2.0。
