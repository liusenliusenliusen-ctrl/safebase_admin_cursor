# SafeBase 管理后台

独立 React 前端，通过 FastAPI 的 **`/api/admin/*`** 查看用户与业务统计。主站用户与数据托管在 **Supabase**（见 [safebase_front_cursor](../safebase_front_cursor)）；本后台仍依赖 **后端服务** 读同一套 Postgres（通常将后端的 `DATABASE_URL` 指向 Supabase 数据库）。

## 功能

- **管理员登录**：请求头携带与后端 `ADMIN_SECRET` 一致的密钥
- **用户列表**：用户、注册时间、消息/摘要/锚点等数量
- **用户详情**：画像、最近对话等（以后端实现为准）

## 技术栈

- React 18、TypeScript、Vite
- Ant Design 5、React Router 6、Axios、Zustand

## 本地运行

1. 启动 **FastAPI 后端**（[safebase_backend_cursor](../safebase_backend_cursor)），`.env` 中配置 `ADMIN_SECRET`，且 `DATABASE_URL` 能访问与主站相同的库（例如 Supabase Postgres 直连串）。
2. 在本目录：

```bash
npm install
npm run dev
```

默认：<http://localhost:5174>。Vite 将 `/api` 代理到 `http://127.0.0.1:8000`。

**注意：必须在本项目根目录执行 `npm run dev` 才会出现管理端页面**；仅启动 Supabase 或仅启动主站前端不会出现 5174。

### 页面打不开？

1. 确认已在 **`safebase_admin_cursor` 根目录**运行 `npm run dev`，终端中的 **Local** 地址为准。
2. 若 5174 被占用，Vite 会改用 5175、5176…
3. 登录页示例：<http://localhost:5174/login>（端口以终端为准）。

## 环境变量

- `VITE_API_BASE_URL`：可选。留空则使用相对路径 `/api`，依赖 Vite 代理到后端；若后端部署在其它域名，填完整 API 根地址（不含路径后缀）。
