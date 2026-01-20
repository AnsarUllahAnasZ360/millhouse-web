# Millhouse Web - System Architecture

> **Version**: 2.0.0
> **Date**: January 19, 2026

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER'S BROWSER                                  │
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │                    Next.js 15 Application (Vercel)                  │    │
│   │                                                                      │    │
│   │   ┌─────────────┐   ┌─────────────┐   ┌────────────────────────┐   │    │
│   │   │   Pages     │   │ Components  │   │   Feature Wrappers     │   │    │
│   │   │             │   │             │   │                        │   │    │
│   │   │ /dashboard  │   │ shadcn/ui   │   │ ExcalidrawWrapper      │   │    │
│   │   │ /boards     │   │ Custom UI   │   │ BlockNoteWrapper       │   │    │
│   │   │ /notes      │   │             │   │ TodoWrapper            │   │    │
│   │   │ /todos      │   │             │   │                        │   │    │
│   │   │ /settings   │   │             │   │                        │   │    │
│   │   └─────────────┘   └─────────────┘   └────────────────────────┘   │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│              │                                      │         │              │
└──────────────┼──────────────────────────────────────┼─────────┼──────────────┘
               │                                      │         │
               │ Convex Client                        │         │ Socket.IO
               ▼                                      │         ▼
┌──────────────────────────────────┐                  │   ┌──────────────────────────┐
│          CONVEX BACKEND          │                  │   │    EXCALIDRAW-ROOM       │
│                                  │                  │   │      (Cloud Run)         │
│  ┌────────────┐ ┌────────────┐   │                  │   │                          │
│  │  Database  │ │  Functions │   │                  │   │  Real-time sync:         │
│  │            │ │            │   │                  │   │  - Cursor positions      │
│  │  users     │ │  queries/  │   │                  │   │  - Element broadcast     │
│  │  workspaces│ │  mutations │   │                  │   │  - Room management       │
│  │  boards    │ │            │   │                  │   │                          │
│  │  notes     │ │            │   │                  │   │  End-to-end encrypted    │
│  │  todos     │ │            │   │                  │   └──────────────────────────┘
│  │  activity  │ │            │   │                  │
│  └────────────┘ └────────────┘   │                  │
│                                  │                  │
│  ┌────────────┐ ┌────────────┐   │                  │
│  │   Storage  │ │ Convex Auth│   │                  │
│  │            │ │            │   │                  │
│  │  Board JSON│ │  Google    │   │                  │
│  │  Thumbnails│ │  OAuth     │   │                  │
│  └────────────┘ └────────────┘   │◄─────────────────┘
│                                  │  Board save (debounced)
└──────────────────────────────────┘
```

---

## 2. Component Responsibilities

| Component | Responsibilities |
|-----------|------------------|
| **Vercel** | Frontend hosting, SSR, edge caching, preview deployments |
| **Convex** | Database, file storage, authentication, real-time subscriptions, serverless functions |
| **excalidraw-room** | Real-time cursor sync (30fps), element broadcast, room management |

---

## 3. Operation Routing

| Operation | Backend | Protocol |
|-----------|---------|----------|
| Cursor sync | excalidraw-room | WebSocket (volatile) |
| Element broadcast | excalidraw-room | WebSocket |
| Board persistence | Convex | Convex protocol |
| Note persistence | Convex | Convex protocol |
| Todo CRUD | Convex | Convex protocol |
| Authentication | Convex Auth | OAuth 2.0 |
| Dashboard data | Convex | Convex protocol |
| Comments | Convex | Convex protocol |
| Activity logs | Convex | Convex protocol |
| Search | Convex | Convex protocol |
| File storage | Convex Storage | Convex protocol |

---

## 4. Real-Time Collaboration Flow

### 4.1 Board Collaboration

```
User A draws element:

User A                    ExcalidrawWrapper              excalidraw-room              Convex
  │                              │                              │                        │
  │─── onChange ────────────────►│                              │                        │
  │                              │─── encrypt + emit ──────────►│                        │
  │                              │                              │─── broadcast ─────────►│ (to User B)
  │                              │                              │                        │
  │                              │─── debounce (5s) ───────────────────────────────────►│
  │                              │                              │                        │── save to storage
  │                              │                              │                        │
```

### 4.2 Cursor Sync

```
User A moves cursor:

User A                    ExcalidrawWrapper              excalidraw-room              User B
  │                              │                              │                        │
  │─── onPointerUpdate ─────────►│                              │                        │
  │    (33ms intervals)          │─── volatile emit ───────────►│                        │
  │                              │                              │─── broadcast ─────────►│
  │                              │                              │    (fire-and-forget)   │
```

### 4.3 Note Editing

```
User edits note:

User                      BlockNoteWrapper                    Convex
  │                              │                              │
  │─── onChange ────────────────►│                              │
  │                              │─── debounce (1s) ───────────►│
  │                              │                              │── update document
  │                              │                              │── trigger subscriptions
  │                              │◄── real-time update ─────────│
```

---

## 5. Authentication Flow

### 5.1 Sign In

```
User                      Next.js                    Convex Auth                 Google
  │                          │                           │                          │
  │── click "Sign in" ──────►│                           │                          │
  │                          │── signIn("google") ──────►│                          │
  │                          │                           │── redirect ─────────────►│
  │                          │                           │                          │── consent
  │                          │                           │◄── callback ─────────────│
  │                          │                           │── create/update user     │
  │◄── redirect to dashboard─│◄──────────────────────────│                          │
```

### 5.2 Invite Flow

```
Admin                     Next.js                    Convex                      Invitee
  │                          │                          │                           │
  │── generate invite ──────►│── createInvite ─────────►│                           │
  │◄── invite link ──────────│◄─────────────────────────│                           │
  │                          │                          │                           │
  │                          │                          │◄── click invite link ─────│
  │                          │                          │── validate token          │
  │                          │                          │── add to workspace        │
  │                          │                          │── redirect ──────────────►│
```

---

## 6. File Structure

```
millhouse-web/
├── .claude/
│   ├── settings.json
│   └── skills/
│       ├── ralph-prd/
│       ├── react-best-practices/
│       ├── test-driven-development/
│       ├── git-workflow/
│       ├── nextjs-patterns/
│       ├── convex-patterns/
│       └── tailwind-shadcn/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── .ralph-tui/
│   └── config.toml
├── convex/
│   ├── _generated/
│   ├── schema.ts
│   ├── auth.ts
│   ├── http.ts
│   ├── users.ts
│   ├── workspaces.ts
│   ├── boards.ts
│   ├── notes.ts
│   ├── todos.ts
│   ├── collections.ts
│   ├── comments.ts
│   ├── activityLogs.ts
│   └── notifications.ts
├── docs/
│   ├── 01-PROJECT_CHARTER.md
│   ├── 02-TECH_STACK.md
│   ├── 03-ARCHITECTURE.md
│   ├── 05-CLAUDE_INIT.md
│   └── phases/
├── public/
│   └── assets/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   └── invite/[token]/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── boards/
│   │   │   ├── notes/
│   │   │   ├── todos/
│   │   │   ├── collections/
│   │   │   └── settings/
│   │   ├── (public)/
│   │   │   └── view/[token]/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── boards/
│   │   │   ├── excalidraw-wrapper.tsx
│   │   │   └── board-card.tsx
│   │   ├── notes/
│   │   │   ├── blocknote-wrapper.tsx
│   │   │   └── note-card.tsx
│   │   ├── todos/
│   │   │   └── todo-item.tsx
│   │   └── shared/
│   ├── hooks/
│   │   ├── use-socket.ts
│   │   └── use-debounce.ts
│   ├── lib/
│   │   ├── convex.ts
│   │   ├── encryption.ts
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.local
├── .env.example
├── .gitignore
├── .mcp.json
├── biome.json
├── CLAUDE.md
├── CONTRIBUTING.md
├── LICENSE
├── next.config.ts
├── package.json
├── playwright.config.ts
├── README.md
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

## 7. Environment Configuration

### 7.1 Local Development (.env.local)

```
CONVEX_DEPLOYMENT=dev:project-name
NEXT_PUBLIC_CONVEX_URL=https://project-name.convex.cloud
NEXT_PUBLIC_COLLAB_SERVER_URL=https://excalidraw-room.example.com
```

### 7.2 Convex Environment Variables

```
AUTH_GOOGLE_ID=<google-client-id>
AUTH_GOOGLE_SECRET=<google-client-secret>
STRIPE_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
SENTRY_DSN=<sentry-dsn>
```

---

## 8. Deployment Pipeline

```
Developer                 GitHub                    GitHub Actions               Vercel/Convex
    │                        │                            │                           │
    │── git push ───────────►│                            │                           │
    │                        │── trigger workflow ───────►│                           │
    │                        │                            │── bun run lint            │
    │                        │                            │── bun run typecheck       │
    │                        │                            │── bun run test            │
    │                        │                            │── bun run build           │
    │                        │                            │── bun run test:e2e        │
    │                        │                            │                           │
    │                        │                            │── deploy (on success) ───►│
    │                        │                            │                           │── Vercel: frontend
    │                        │                            │                           │── Convex: backend
```

---

## 9. Development Tools Integration

| Tool | Integration Point |
|------|-------------------|
| **Ralph TUI** | Autonomous development loops via PRDs |
| **Agent Browser CLI** | E2E testing automation |
| **Greptile CLI** | Codebase search and understanding |
| **Context7 MCP** | Real-time documentation access |
| **Convex MCP** | Database introspection |
| **shadcn/ui MCP** | Component registry access |
| **GitHub CLI** | PR and issue management |
| **Vercel CLI** | Deployment management |
| **Playwright** | E2E test generation and execution |

---

## 10. Security

| Layer | Implementation |
|-------|----------------|
| Authentication | Convex Auth with Google OAuth |
| Authorization | Role-based (admin, member) per workspace |
| Data isolation | Workspace-scoped queries with auth validation |
| Board encryption | End-to-end encryption via excalidraw-room |
| API protection | Convex built-in rate limiting |
| Secrets | Environment variables, never in code |

---

*Document Version: 2.0.0 | January 19, 2026*
