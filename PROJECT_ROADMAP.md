# Intracom roadmap

Step-by-step path from MVP to enterprise scale. **Completed items are checked.**

---

## Phase 1: Lean & mean

### Widget
- [x] Preact + Vite library mode
- [x] Zustand state (`useWidgetStore`)
- [x] Shadow DOM loader
- [x] Socket.IO client
- [x] `@intracom/contracts` socket events
- [x] CDN deploy (`widget.js`)

### Backend
- [x] NestJS monolith
- [x] Prisma + PostgreSQL (`AdminUser`, `Conversation`, `Message`)
- [x] JWT auth with feature flags ([AUTHENTICATION.md](./docs/AUTHENTICATION.md))
- [x] Chat REST + persistence ([CHAT.md](./docs/CHAT.md))
- [x] Socket.IO gateway + Redis adapter
- [x] Stats API ([ANALYTICS.md](./docs/ANALYTICS.md))
- [x] `@intracom/contracts` shared package ([PACKAGES.md](./docs/PACKAGES.md))

### Admin dashboard
- [x] Next.js App Router + `intracom-ui`
- [x] Auth login + protected routes
- [x] Chat inbox (REST + socket merge)
- [x] Inbox search + resolve conversation
- [x] Real analytics (`StatsView` → `/stats/dashboard`)
- [x] Settings page (account + env flags)
- [ ] User list / visitor profiles (roadmap `User` model with JSONB)

### Caching & jobs
- [x] Redis Socket.IO adapter
- [ ] BullMQ job queue (email notifications)

### DevOps
- [x] `docker-compose.yml` (Postgres + Redis)
- [x] Root workspace `package.json`
- [ ] Dockerfile for server
- [ ] CI (GitHub Actions)
- [ ] Deploy backend + admin

---

## Phase 2: Scale up

- [ ] Message store offload (Mongo / Elasticsearch)
- [ ] Full-text search
- [ ] Extract notification worker microservice
- [ ] SQS / SNS between services
- [ ] Publish `@intracom/contracts` to private npm per repo

---

## Phase 3: Enterprise

- [ ] Kubernetes (EKS) + Helm
- [ ] Kafka event streaming
- [ ] CQRS read/write split
- [ ] Observability (Prometheus, Grafana, tracing)

---

## Suggested next tasks

1. BullMQ + “new message” email worker
2. Dockerfile + CI pipeline
3. Visitor `User` model + admin user list
4. Auth hardening (rate limit, httpOnly cookies)
