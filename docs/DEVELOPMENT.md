# Local development

One guide to run Intracom on your machine.

## Prerequisites

- Node.js 20+
- npm 10+
- Docker (optional, for PostgreSQL + Redis)

## Quick start (no database)

Good for auth + socket smoke tests.

```bash
# From repo root
npm install

# Terminal 1 — API
cd server && cp .env.example .env && npm run start:dev

# Terminal 2 — Admin
cd admin && cp .env.example .env.local && npm run dev
```

Open [http://localhost:3001/login](http://localhost:3001/login) — default `admin@intracom.com` / `changeme`.

## Full stack (with persistence)

### 1. Start infrastructure

```bash
docker compose up -d
```

### 2. Server

```bash
cd server
cp .env.example .env
```

Set at minimum:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/intracom?schema=public
FEATURE_CHAT_PERSISTENCE=true
FEATURE_STATS_API=true
```

```bash
npx prisma migrate dev
npm run start:dev
```

API: [http://localhost:3000/api](http://localhost:3000/api)

### 3. Admin

```bash
cd admin
cp .env.example .env.local
npm run dev
```

Dashboard: [http://localhost:3001](http://localhost:3001)

### 4. Widget (optional)

```bash
cd widget
npm run dev
```

Point the widget at `http://localhost:3000` for sockets.

## Root workspace commands

From repo root (after `npm install`):

| Command | Description |
|---------|-------------|
| `npm run build:contracts` | Build `@intracom/contracts` |
| `npm run dev:server` | NestJS watch mode |
| `npm run dev:admin` | Next.js on port 3001 |
| `npm run dev:widget` | Vite widget dev |
| `npm run test:server` | Server unit tests |

## Build order

`@intracom/contracts` must be built before apps that import it. Each app runs `prebuild` / `postinstall` hooks automatically.

Manual:

```bash
npm run build:contracts
npm run build:server
npm run build:admin
```

## Environment files

| App | Template | Gitignored |
|-----|----------|------------|
| server | `server/.env.example` | `server/.env` |
| admin | `admin/.env.example` | `admin/.env.local` |

Never commit secrets. See [AUTHENTICATION.md](./AUTHENTICATION.md) and [CHAT.md](./CHAT.md) for flag details.

## Ports

| Service | Port |
|---------|------|
| NestJS API + Socket.IO | 3000 |
| Admin dashboard | 3001 |
| PostgreSQL | 5432 |
| Redis | 6379 |

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Cannot find module '@intracom/contracts'` | `npm run build:contracts` |
| Empty inbox after refresh | `FEATURE_CHAT_PERSISTENCE=true`, run migrations |
| Analytics empty | Postgres running, messages in DB |
| 401 on API | Log in again; check cookie `token` |
| Prisma P1001 | `docker compose up -d` |

## Related guides

- [ARCHITECTURE.md](./ARCHITECTURE.md) — flows and boundaries
- [PACKAGES.md](./PACKAGES.md) — shared packages
- [AUTHENTICATION.md](./AUTHENTICATION.md)
- [CHAT.md](./CHAT.md)
- [ANALYTICS.md](./ANALYTICS.md)
