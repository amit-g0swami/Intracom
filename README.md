# Intracom

Embeddable customer chat platform — widget, admin dashboard, and NestJS backend.

**New developers:** start at [docs/README.md](./docs/README.md).

## Repository structure

| Directory | Role |
|-----------|------|
| `contracts/` | `@intracom/contracts` — shared types |
| `frontend-library/` | `intracom-ui` — React components |
| `server/` | NestJS API + WebSockets + Prisma |
| `admin/` | Next.js admin dashboard |
| `widget/` | Preact embeddable widget |
| `docs/` | Architecture, setup, feature guides |

## Quick start

```bash
docker compose up -d          # optional Postgres + Redis
npm install                   # from repo root
cd server && cp .env.example .env && npx prisma migrate dev && npm run start:dev
cd admin && cp .env.example .env.local && npm run dev
```

Admin: [http://localhost:3001](http://localhost:3001) · API: [http://localhost:3000/api](http://localhost:3000/api)

## Widget embed

```html
<script src="https://intracom.goswamiempire.workers.dev/widget.js" data-app-id="my-first-test-app" defer></script>
```

## Documentation

- [Architecture & flows](./docs/ARCHITECTURE.md)
- [Local development](./docs/DEVELOPMENT.md)
- [Shared packages](./docs/PACKAGES.md)
- [Authentication](./docs/AUTHENTICATION.md)
- [Chat & inbox](./docs/CHAT.md)
- [Analytics](./docs/ANALYTICS.md)
- [Roadmap](./PROJECT_ROADMAP.md)
