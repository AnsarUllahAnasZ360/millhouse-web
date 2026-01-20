# Millhouse Web - Project Charter

> **Version**: 2.0.0
> **Date**: January 19, 2026

---

## 1. Project Overview

| Field | Value |
|-------|-------|
| **Project Name** | Millhouse Web |
| **Type** | Real-time Collaborative Productivity Platform |
| **License** | MIT |
| **Status** | Phase 0 - Initialization |

---

## 2. Product Description

Millhouse Web is a collaborative productivity platform providing:

- **Boards** - Real-time whiteboarding via Excalidraw
- **Notes** - Block-based note editor via BlockNote
- **Todos** - Personal task management with drag-and-drop
- **Workspaces** - Team collaboration with role-based access
- **Collections** - Organization of boards and notes
- **Real-time Sync** - Live collaboration on boards

---

## 3. Core Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui |
| Backend | Convex |
| Auth | Convex Auth (Google OAuth) |
| Real-time Boards | excalidraw-room |
| Hosting | Vercel |
| Runtime | Bun |

---

## 4. Development Methodology

### 4.1 AI-First Development

| Component | Tool |
|-----------|------|
| Autonomous execution | Ralph TUI |
| Code assistance | Claude Code |
| E2E testing | Agent Browser CLI |
| Code search | Greptile CLI |

### 4.2 Quality Gates

| Gate | Tool |
|------|------|
| Lint/Format | Biome |
| Type Safety | TypeScript strict |
| Unit Tests | Vitest |
| E2E Tests | Playwright |
| Build | Next.js |

### 4.3 Git Workflow

| Item | Convention |
|------|------------|
| Branch naming | `phase-N/feature-name` |
| Commit format | Conventional commits |
| PRs | Required for main branch |
| CI | GitHub Actions |

---

## 5. Phase Overview

| Phase | Name | Status |
|-------|------|--------|
| 0 | Initialization | In Progress |
| 1 | UI Foundations | Planned |
| 2 | Excalidraw Boards | Planned |
| 3 | BlockNote Notes | Planned |
| 4 | Personal Todos | Planned |
| 5 | Collections & Sharing | Planned |
| 6 | Comments & Mentions | Planned |
| 7 | Global Search | Planned |
| 8 | Favorites | Planned |
| 9 | Activity Logs | Planned |
| 10 | Dashboard | Planned |
| 11 | Quick Create | Planned |
| 12-20 | Testing, Docs, Polish | Planned |

---

## 6. Team & Roles

| Role | Responsibility |
|------|----------------|
| Human | Architecture, PRD creation, review, deployment config |
| AI Agent | Implementation, testing, documentation |

---

## 7. Integrations

| Service | Purpose |
|---------|---------|
| GitHub | Version control, CI/CD |
| Vercel | Frontend hosting |
| Convex | Backend, database |
| Stripe | Payments (future) |
| Sentry | Error tracking |
| PostHog | Analytics |
| Greptile | Code review |

---

## 8. Documentation

| Document | Purpose |
|----------|---------|
| README.md | Project overview, setup instructions |
| CLAUDE.md | AI agent context |
| CONTRIBUTING.md | Contribution guidelines |
| docs/02-TECH_STACK.md | Technology decisions |
| docs/03-ARCHITECTURE.md | System design |
| docs/05-CLAUDE_INIT.md | Claude Code configuration |

---

## 9. Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost:3000 | Local development |
| Preview | *.vercel.app | PR previews |
| Production | TBD | Live application |

---

## 10. References

- [Tech Stack](./02-TECH_STACK.md)
- [Architecture](./03-ARCHITECTURE.md)
- [Claude Configuration](./05-CLAUDE_INIT.md)
- [Phase 0 PRD](./phases/phase-00-init.md)

---

*Document Version: 2.0.0 | January 19, 2026*
