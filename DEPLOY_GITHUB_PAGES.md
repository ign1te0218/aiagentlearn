# 部署到 GitHub Pages

## 部署结果

建议将 `ai-learning-platform` 目录作为独立仓库根目录。推送到 GitHub 后，GitHub Actions 会自动发布静态站点。

项目仓库地址格式：

```text
https://<GitHub用户名>.github.io/<仓库名>/
```

若仓库名正好是 `<GitHub用户名>.github.io`，地址为：

```text
https://<GitHub用户名>.github.io/
```

## 第一次上传

1. 在 GitHub 新建一个空仓库，例如 `agentpath-learning`。不要添加包含其他内容的初始化模板。
2. 在本目录打开 PowerShell。
3. 执行以下命令，把 `<仓库地址>` 替换为实际 HTTPS 或 SSH 地址：

```powershell
git init
git branch -M main
git add .
git commit -m "feat: publish AgentPath learning platform"
git remote add origin <仓库地址>
git push -u origin main
```

4. 打开 GitHub 仓库的 **Settings -> Pages**。
5. 在 **Build and deployment** 中将 Source 设置为 **GitHub Actions**。
6. 打开 **Actions**，等待内容校验与 `Deploy AgentPath to GitHub Pages` 完成。
7. 部署完成后，Actions 运行结果和 Pages 设置页都会显示在线地址。

## 后续更新

修改课程后执行：

```powershell
git add .
git commit -m "docs: update AgentPath course content"
git push
```

推送到 `main` 会自动重新部署。学习进度保存在访问该域名的浏览器 `localStorage` 中；更换浏览器、域名或清理站点数据后，进度不会自动同步。

部署工作流会先运行 `node scripts/verify-content.mjs`。如果章节、Demo 或相对资源不完整，部署会停止并在 Actions 日志中给出具体章节 ID。

## 仓库可见性

- 公共仓库可以直接使用 GitHub Pages。
- 私有仓库是否可以发布 Pages 取决于 GitHub 账户和组织套餐。
- 页面为纯静态内容，不要提交模型 API Key、密码、Token、`.env` 或真实业务数据。
