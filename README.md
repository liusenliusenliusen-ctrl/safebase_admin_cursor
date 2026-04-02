# SafeBase 管理后台

管理员查看用户信息的独立前端，与主应用（safebase_front_cursor）共用后端 API。

## 功能

- **管理员登录**：使用与后端 `ADMIN_SECRET` 一致的密钥登录
- **用户列表**：查看所有用户、注册时间、消息/摘要/锚点数量
- **用户详情**：查看用户基本信息、画像内容、最近对话记录

## 技术栈

- React 18 + TypeScript + Vite
- Ant Design 5
- React Router 6、Axios、Zustand

## 本地运行

1. 确保后端已启动（默认 `http://127.0.0.1:8000`），并在后端 `.env` 中配置 `ADMIN_SECRET`。
2. 安装依赖并启动：

```bash
npm install
npm run dev
```

默认访问：<http://localhost:5174>。代理将 `/api` 转发到后端。

**注意：管理后台是独立前端，必须在本目录执行 `npm run dev` 后才能用浏览器打开。** 仅启动后端（8000）不会自动出现 5174 页面。

### 页面打不开？

1. 确认已在 **`safebase_admin_cursor` 项目根目录**运行 `npm run dev`，终端应出现 `Local: http://localhost:5174/`。
2. 若 5174 已被占用，Vite 会自动改用 **5175、5176…**，请以终端里打印的 **Local** 地址为准。
3. 可直接访问登录页：<http://localhost:5174/login>（端口以终端为准）。

## 环境变量

- `VITE_API_BASE_URL`：可选，API 基础路径，留空则使用相对路径（配合 Vite 代理）。
