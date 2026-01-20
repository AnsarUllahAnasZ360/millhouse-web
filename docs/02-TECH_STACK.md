# Millhouse Web - Technology Stack

> **Version**: 2.0.0
> **Date**: January 19, 2026

---

## 1. Core Stack

| Category | Technology | Version |
|----------|------------|---------|
| Language | TypeScript | 5.7+ |
| UI Library | React | 19.x |
| Framework | Next.js (App Router) | 15.x |
| UI Components | shadcn/ui | Latest |
| Styling | Tailwind CSS | 4.x |
| Backend/Database | Convex | 1.18+ |
| Authentication | Convex Auth | Latest |
| Hosting | Vercel | - |
| Runtime | Bun | 1.1+ |
| Version Control | GitHub | - |

---

## 2. Feature Stack

| Feature | Technology | Version |
|---------|------------|---------|
| Whiteboarding | @excalidraw/excalidraw | 0.18+ |
| Real-time Whiteboard Sync | excalidraw-room | Latest |
| Note Editor | @blocknote/core, @blocknote/react | 0.46+ |
| Todo Drag & Drop | @dnd-kit/core, @dnd-kit/sortable | Latest |
| Documentation Site | Fumadocs | Latest |
| Mobile (Future) | Capacitor | Latest |

---

## 3. Code Quality

| Tool | Purpose |
|------|---------|
| Biome | Linting, Formatting, Import Organization |
| TypeScript | Type Checking (strict mode) |

---

## 4. Testing Stack

| Test Type | Tool |
|-----------|------|
| Lint/Format | Biome |
| Type Check | TypeScript (tsc --noEmit) |
| Unit Tests | Vitest |
| Component Tests | Vitest + @testing-library/react |
| Integration Tests | Vitest + convex-test |
| E2E Tests | Playwright |
| AI-Driven E2E | Agent Browser CLI |

---

## 5. Infrastructure

| Service | Provider |
|---------|----------|
| Frontend Hosting | Vercel |
| Backend/Database | Convex |
| WebSocket Server | Cloud Run |
| Domain | Hostinger |
| CI/CD | GitHub Actions |

---

## 6. Integrations

| Category | Technology |
|----------|------------|
| Payments | Stripe + @convex-dev/stripe |
| Email | Resend |
| Analytics | PostHog |
| Error Tracking | Sentry |
| Code Review | Greptile |
| AI Features | Claude Agent SDK |

---

## 7. Production Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "convex": "^1.18.0",
    "@convex-dev/auth": "^0.0.80",
    "tailwindcss": "^4.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.6.0",
    "lucide-react": "^0.469.0",
    "@excalidraw/excalidraw": "^0.18.0",
    "socket.io-client": "^4.8.0",
    "@blocknote/core": "^0.46.0",
    "@blocknote/react": "^0.46.0",
    "@dnd-kit/core": "^6.3.0",
    "@dnd-kit/sortable": "^9.0.0",
    "next-themes": "^0.4.0",
    "sonner": "^1.7.0"
  }
}
```

---

## 8. Development Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@biomejs/biome": "^1.9.0",
    "vitest": "^2.1.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@vitejs/plugin-react": "^4.3.0",
    "convex-test": "^0.0.35",
    "@playwright/test": "^1.49.0"
  }
}
```

---

## 9. CLI Tools

| CLI | Purpose | Install |
|-----|---------|---------|
| Bun | Package manager, runtime | Pre-installed |
| Convex CLI | Database management, deployment | `bunx convex` |
| Vercel CLI | Deployment, preview | `bun add -g vercel` |
| GitHub CLI | PR, issues, workflows | `brew install gh` |
| Stripe CLI | Payment testing, webhooks | `brew install stripe/stripe-cli/stripe` |
| Sentry CLI | Error tracking, source maps | `bun add -D @sentry/cli` |
| PostHog CLI | Analytics, source maps | `bun add -D @posthog/cli` |
| Playwright | E2E testing | `bunx playwright` |
| Ralph TUI | Autonomous loops | Pre-installed |
| Agent Browser | AI-driven E2E | Pre-installed |

---

## 10. Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --fix .",
    "format": "biome format --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "convex:dev": "convex dev",
    "convex:deploy": "convex deploy"
  }
}
```

---

## 11. CI Pipeline

```
1. bun run lint        → Code quality
2. bun run typecheck   → Type safety
3. bun run test        → Unit + Component + Integration
4. bun run build       → Build validation
5. bun run test:e2e    → E2E tests
```

---

*Document Version: 2.0.0 | January 19, 2026*
