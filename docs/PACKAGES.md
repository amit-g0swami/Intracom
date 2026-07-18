# Shared packages

## @intracom/contracts

**Path:** `contracts/`  
**Purpose:** Single source of truth for API shapes, socket events, and domain events.

### Contents

| Module | Exports |
|--------|---------|
| `auth` | `AuthUser`, `LoginResponse`, `AuthStatus` |
| `chat` | `Message`, `ConversationSummary`, `SendMessagePayload` |
| `socket` | `SOCKET_EVENTS`, `SocketMessagePayload` |
| `events` | `DOMAIN_EVENTS`, `MessageSentEventPayload` |
| `stats` | `AnalyticsDashboard`, `AnalyticsOverview` |
| `visitor` | `VisitorSummary`, `VisitorProfile`, `UpdateVisitorPayload` |

### Local consumption (monorepo)

```json
"@intracom/contracts": "file:../contracts"
```

Build:

```bash
cd contracts && npm run build
```

### Publishing (when splitting microservices)

1. Bump version in `contracts/package.json`.
2. Publish to private npm (GitHub Packages, CodeArtifact, etc.).
3. In each service: `"@intracom/contracts": "^0.1.0"`.
4. Pin versions in production — do not use `*` ranges.

### Rules

- Additive changes → minor version.
- Breaking field renames → major version.
- No NestJS, Prisma, or React in this package.

---

## intracom-ui

**Path:** `frontend-library/`  
**npm name:** `intracom-ui`  
**Purpose:** Atomic Design React components for the admin dashboard.

### Local consumption

```json
"intracom-ui": "file:../frontend-library"
```

Build before admin:

```bash
cd frontend-library && npm run build
```

### Usage

```tsx
import { Button, StatCard, SearchInput } from 'intracom-ui';
```

Import styles: components inject theme tokens automatically. Override `--sp-*` CSS variables in admin `globals.css` if needed.

### Development

```bash
cd frontend-library
npm run storybook   # port 6006
npm run test
```

Full component list and theming: run Storybook locally.

---

## Dependency graph

```text
contracts  ←  server, admin, widget
intracom-ui  ←  admin only
```

Server never imports `intracom-ui`. Widget never imports `intracom-ui`.
