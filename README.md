# AgentPath 本地学习平台

一个零依赖的本地教程平台，课程覆盖 TypeScript、Node.js、Python 基础，以及大模型应用、RAG、Agent、MCP、评测和部署。

当前共 51 章：基础预备阶段 30 章，岗位主线 21 章（16 个工程章 + NestJS、LLM、RAG、Agent、MCP 5 个概念导论）。岗位主线统一按“是什么 -> 为什么需要 -> 核心机制 -> 边界与误区 -> 最小机制实验 -> 工程 Demo”学习。全部章节都包含原理讲解、逐步练习、最小可运行 Demo、运行命令、预期结果、常见问题、实践验收和 3 道理解测验。章节完成需要同时通过理解测验并完成实践验收。

建议学习周期为 24 周：F1-F8 基础预备 8 周，W1-W16 岗位主线 16 周。环境统一使用 Node.js 24 LTS 与 Python 3.12+。

## 启动

在 PowerShell 中运行：

```powershell
.\start.ps1
```

脚本会优先使用系统中的 Node.js 20+；如果系统版本过旧，则尝试使用 Codex 工作区附带的 Node.js。服务默认从 `http://127.0.0.1:4173` 启动，端口占用时会自动尝试后续端口。
本地服务器对教程资源使用 `no-store`，修改页面或课程脚本后刷新即可看到最新版本，不会出现 HTML 与 JavaScript 缓存不一致。

也可以使用 Node.js 24 LTS 直接运行：

```powershell
node server.js
```

## 数据存储

学习进度、测验成绩、收藏和主题设置保存在当前浏览器的 `localStorage` 中，不会上传到外部服务。
桌面端课程目录可以从头部按钮向左收起，收起状态同样保存在当前浏览器中；移动端继续使用抽屉式目录。

## 内容校验

发布或修改课程后运行：

```powershell
node scripts/verify-content.mjs
```

校验会检查 JavaScript、TypeScript 和 Python Demo 语法，解析 JSON，检查 SQL 基本结构与渲染后的 Windows 命令，并核对 10 个模块、51 章、153 道题、岗位主线知识优先结构、唯一题目 ID、答案范围、解析、每章讲解/练习/Demo/资料和 GitHub Pages 相对资源路径。GitHub Actions 会在每次部署前自动运行同一校验。

## 技术结构

- `index.html`：应用结构
- `styles.css`：桌面与移动端布局
- `course-data.js`：岗位主线原始课程内容
- `foundation-data.js`：基础课程公共结构、资料与导学
- `foundation-typescript.js`：TypeScript 8 章详细教程
- `foundation-nodejs.js`：Node.js 9 章详细教程
- `foundation-python.js`：Python 8 章详细教程
- `foundation-backend.js`：SQL/PostgreSQL、Redis、鉴权与测试 4 章
- `foundation-demos.js`：30 个基础章节完整可运行 Demo
- `main-details.js`：W1-W16 教程详情与最小可运行 Demo
- `foundation-apply.js`：合并基础阶段与岗位主线
- `job-track-foundations.js`：岗位主线 5 个概念导论与 W1-W16 知识优先讲解层
- `quiz-data.js`：51 章共 153 道理解测验题、答案与解析
- `app.js`：导航、搜索、进度、书签和章节渲染
- `server.js`：零依赖本地静态服务器
- `scripts/verify-content.mjs`：课程结构、内容完整度和静态资源校验
- `assets/lucide.min.js`：Lucide 图标库

## 第三方资源

Lucide 图标库依据 ISC License 使用，许可文件见 `assets/LUCIDE_LICENSE.txt`。

## GitHub Pages

本目录可以直接作为一个独立 GitHub 仓库。仓库推送到 `main` 后，内置 GitHub Actions 会部署静态站点。首次使用需要在仓库的 **Settings -> Pages** 中将 Source 设置为 **GitHub Actions**。

仓库已包含 `.gitignore`，默认排除 `.env`、`node_modules` 和常见系统临时文件。推送前仍应检查 `git status`，不得提交 API Key、Token 或真实业务数据。

项目仓库的默认地址为：

```text
https://<GitHub用户名>.github.io/<仓库名>/
```

具体步骤见 `DEPLOY_GITHUB_PAGES.md`。平台使用相对资源路径，不需要为仓库子路径修改代码。
