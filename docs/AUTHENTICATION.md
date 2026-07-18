# Authentication Guide

Admin JWT authentication with feature flags. See also [ARCHITECTURE.md](./ARCHITECTURE.md) and [DEVELOPMENT.md](./DEVELOPMENT.md).

Step 2 of the Intracom roadmap: real authentication with **feature flags** so you can develop locally without a database, then turn on production-grade auth when ready.

## Architecture

| Layer | Responsibility |
|-------|----------------|
| **Server** (`server/`) | JWT issuance, credential validation, optional socket auth |
| **Admin** (`admin/`) | Login UI, token storage (cookie), API client, socket handshake |
| **Feature flags** | Toggle mock vs API auth, env vs database validation, socket JWT |

```
Admin login  →  POST /api/auth/login  →  JWT
Admin app    →  GET  /api/auth/me     →  profile (Bearer token)
Admin socket →  handshake.auth.token  →  optional JWT verify
```

## Quick start (no database)

Best for first-time local testing.

### 1. Server

```bash
cd server
cp .env.example .env
```

Ensure `.env` contains:

```env
FEATURE_AUTH_ENABLED=true
AUTH_MODE=env
FEATURE_SOCKET_AUTH=false
ADMIN_SEED_EMAIL=admin@intracom.com
ADMIN_SEED_PASSWORD=changeme
AUTH_JWT_SECRET=local-dev-secret
```

```bash
npm install
npm run start:dev
```

### 2. Admin

```bash
cd admin
cp .env.example .env.local
```

Ensure `.env.local` contains:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXT_PUBLIC_FEATURE_MOCK_AUTH=false
NEXT_PUBLIC_FEATURE_SOCKET_AUTH=false
```

```bash
npm install
npm run dev
```

### 3. Sign in

Open [http://localhost:3001/login](http://localhost:3001/login) and use:

- **Email:** `admin@intracom.com`
- **Password:** `changeme`

(or whatever you set in `ADMIN_SEED_*`)

---

## Feature flags reference

### Server (`server/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `FEATURE_AUTH_ENABLED` | `true` | Enables `/api/auth/*` endpoints |
| `AUTH_MODE` | `env` | `mock` \| `env` \| `database` |
| `FEATURE_SOCKET_AUTH` | `false` | Require JWT for admin WebSocket connections |
| `AUTH_JWT_SECRET` | dev fallback | **Must change in production** |
| `AUTH_JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `ADMIN_SEED_EMAIL` | `admin@intracom.com` | Env-mode login email |
| `ADMIN_SEED_PASSWORD` | `changeme` | Env-mode login password |
| `ADMIN_SEED_NAME` | `Admin User` | Display name in JWT/profile |

### Admin (`admin/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api` | REST API base URL |
| `NEXT_PUBLIC_SOCKET_URL` | `http://localhost:3000` | Socket.IO server |
| `NEXT_PUBLIC_FEATURE_MOCK_AUTH` | `false` | Skip API; use local mock token |
| `NEXT_PUBLIC_FEATURE_SOCKET_AUTH` | `false` | Send JWT in socket `auth.token` |

---

## Auth modes (`AUTH_MODE`)

### `mock` (UI-only)

- Server accepts **any** email/password and returns a JWT.
- Use only for rapid UI work — **never in production**.

```env
AUTH_MODE=mock
```

### `env` (recommended for local dev)

- Validates against `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`.
- No PostgreSQL required.

```env
AUTH_MODE=env
ADMIN_SEED_EMAIL=admin@intracom.com
ADMIN_SEED_PASSWORD=changeme
```

### `database` (production)

- Validates against hashed passwords in `AdminUser` (Prisma).
- Seeds the admin user on startup if missing.

```env
AUTH_MODE=database
DATABASE_URL=postgresql://...
```

```bash
cd server
npx prisma migrate dev --name add-admin-user
npm run start:dev
```

---

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/auth/status` | Public | Feature flag status |
| `POST` | `/api/auth/login` | Public | Returns `{ accessToken, user }` |
| `GET` | `/api/auth/me` | Bearer JWT | Current user profile |

### Example: login with curl

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@intracom.com","password":"changeme"}'
```

### Example: profile

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <accessToken>"
```

---

## Socket authentication (optional)

Enable when you want admin sockets to require a valid JWT.

**Server:**

```env
FEATURE_SOCKET_AUTH=true
```

**Admin:**

```env
NEXT_PUBLIC_FEATURE_SOCKET_AUTH=true
```

The admin client sends the cookie token via `handshake.auth.token`. Unauthenticated admin connections are disconnected.

---

## Mock auth (admin-only)

For frontend work without running the server:

```env
# admin/.env.local
NEXT_PUBLIC_FEATURE_MOCK_AUTH=true
```

The login page shows a warning banner. Any credentials succeed after a short delay.

---

## Testing matrix

| Scenario | Server `AUTH_MODE` | Admin `MOCK_AUTH` | Database |
|----------|-------------------|-------------------|----------|
| Full local (default) | `env` | `false` | Not required |
| UI only | — | `true` | Not required |
| Production | `database` | `false` | Required |
| Unsafe dev | `mock` | `false` | Not required |

---

## Security checklist (before production)

- [ ] Set a strong `AUTH_JWT_SECRET` (32+ random characters)
- [ ] Set `AUTH_MODE=database`
- [ ] Set `FEATURE_SOCKET_AUTH=true`
- [ ] Set `NEXT_PUBLIC_FEATURE_MOCK_AUTH=false`
- [ ] Use HTTPS for admin and API
- [ ] Rotate `ADMIN_SEED_PASSWORD` after first deploy

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `401` on login | Check `ADMIN_SEED_*` matches credentials, or run Prisma migrate for `database` mode |
| `401` on `/me` | Token expired or `AUTH_JWT_SECRET` changed — sign in again |
| Socket won't connect with auth on | Ensure both `FEATURE_SOCKET_AUTH` and `NEXT_PUBLIC_FEATURE_SOCKET_AUTH` are `true` |
| CORS errors | Server has `enableCors()` — verify `NEXT_PUBLIC_API_URL` host/port |
| Admin can't reach API | Confirm server runs on port `3000` and prefix is `/api` |

---

## Next steps (roadmap)

- [ ] Refresh tokens / httpOnly cookies
- [ ] Role-based guards on chat REST endpoints
- [ ] Widget visitor session tokens (separate from admin JWT)
- [ ] Rate limiting on `/auth/login`
