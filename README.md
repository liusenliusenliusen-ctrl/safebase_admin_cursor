# SafeBase · 管理后台

独立 React 应用，供运营/开发查看 **Supabase 注册用户** 与业务数据统计。不实现主站功能，不连接 Supabase 客户端；所有数据经 FastAPI **`/api/admin/*`** 读取与主站**同一 Postgres**。

| 仓库 | 角色 |
|------|------|
| [safebase_front_cursor](../safebase_front_cursor) | 主站：Auth、对话、日记、迁移、Edge |
| [safebase_backend_cursor](../safebase_backend_cursor) | 本后台依赖的 API + 夜间批处理 |
| **本仓库** | 只读展示 + Admin Key 登录 |

## 架构

```text
浏览器 (localhost:5174)
  → Vite proxy /api → FastAPI :8000
       → routers_admin.py
            → auth.users（用户列表）
            → messages / profiles / summaries / anchors（统计与详情）
```

主站用户**不会**出现在已废弃的 `public.users` 表；后端已改为查询 **`auth.users`**。

## 功能

| 页面 | 路由 | API |
|------|------|-----|
| 登录 | `/login` | `GET /api/admin/users`（校验 `X-Admin-Key`） |
| 用户列表 | `/` | `GET /api/admin/users` |
| 用户详情 | `/users/:id` | `GET /api/admin/users/{user_id}?messages_limit=50` |

登录方式：在页面输入与后端 **`ADMIN_SECRET`** 相同的密钥；前端将其存入 Zustand（`stores/adminStore.ts`），后续请求由 `api/client.ts` 附加请求头：

```http
X-Admin-Key: <你的 ADMIN_SECRET>
```

详情页展示：用户名、注册时间、画像 Markdown、消息/摘要/锚点数量、最近若干条 `messages`（role + content + 时间）。

## 本地运行（三步）

### 1. 数据库与迁移

在 `safebase_front_cursor`：

```bash
supabase start
supabase db reset   # 或 migration up
```

### 2. 启动后端 API

在 `safebase_backend_cursor`：

```bash
cp .env.example .env
# 填写 DATABASE_URL（指向 Supabase 本地 DB，如 127.0.0.1:54322）
# 填写 ADMIN_SECRET=你的管理密钥

npm install
npm run dev            # 默认 http://0.0.0.0:8000
```

`OPENROUTER_API_KEY` 仅夜间批处理需要；**仅看管理后台可不配**。

### 3. 启动本前端

**必须在本仓库根目录**执行：

```bash
npm install
npm run dev
```

默认 <http://localhost:5174>；若端口占用，以终端输出的 Local 为准。

Vite 配置（`vite.config.ts`）将 `/api` 代理到 `http://127.0.0.1:8000`。

## 环境变量

| 变量 | 说明 |
|------|------|
| `VITE_API_BASE_URL` | 可选。留空则使用相对路径 `/api`（依赖上述代理）；若 API 部署在其他域名，填完整根 URL（无尾部斜杠） |

示例 `.env`（可选）：

```bash
# VITE_API_BASE_URL=https://api.example.com
```

## 技术栈

- React 18、TypeScript、Vite 5  
- Ant Design 5、React Router 6、Axios、Zustand  

## 目录结构

```text
src/
  api/admin.ts       # listUsers / getUserDetail
  api/client.ts      # axios + X-Admin-Key 拦截器
  pages/LoginPage.tsx
  pages/UserListPage.tsx
  pages/UserDetailPage.tsx
  components/AdminRoute.tsx
  stores/adminStore.ts
```

## 常见问题

**页面打不开？**

- 确认在 `safebase_admin_cursor` 下运行 `npm run dev`，而不是只启动主站 5173 或 Supabase。  
- 确认后端 8000 已启动且无 CORS/代理错误。  

**用户列表为空？**

- 确认主站已通过 Supabase Auth 注册过用户（`auth.users` 有记录）。  
- 确认 `DATABASE_URL` 与主站是**同一个**数据库实例。  

**401 Invalid admin key？**

- 登录页输入的密钥必须与后端 `.env` 的 `ADMIN_SECRET` 完全一致。  

## 构建

```bash
npm run build
npm run preview
```

生产部署时需将 `VITE_API_BASE_URL` 指向实际后端地址，或由网关统一转发 `/api/admin`。
