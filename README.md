# SafeBase · 管理后台

独立 React 应用，供运营/开发查看注册用户与业务数据统计。数据经 Node 后端 **`/api/admin/*`** 读取，与主站共用 **Postgres**。

| 仓库 | 角色 |
|------|------|
| [safebase_front_cursor](../safebase_front_cursor) | 主站前端 |
| [safebase_backend_cursor](../safebase_backend_cursor) | Fastify API + 数据库 |
| **本仓库** | 只读展示 + Admin Key 登录 |

## 架构

```text
浏览器 (:5174)
  → Vite proxy /api → Fastify :8000
       → /api/admin/*
            → public.users（用户列表）
            → messages / profiles / summaries / anchors
```

## 本地运行

```bash
# 1. 后端仓库
cd ../safebase_backend_cursor
docker compose up -d
cp .env.example .env   # ADMIN_SECRET、JWT_SECRET、DATABASE_URL
npm install && npm run dev

# 2. 本仓库
cd ../safebase_admin_cursor
npm install && npm run dev   # http://localhost:5174
```

登录密钥 = 后端 `.env` 的 **`ADMIN_SECRET`**。

## 环境变量

| 变量 | 说明 |
|------|------|
| `VITE_API_BASE_URL` | 可选；留空则 Vite 代理 `/api` → `:8000` |

## 常见问题

- **用户列表为空**：先在主站注册用户；确认 `DATABASE_URL` 与主站同一库。
- **401**：登录密钥须与 `ADMIN_SECRET` 完全一致。

## 构建

```bash
npm run build
npm run preview
```
