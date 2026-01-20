# Millhouse Web

> Everything's coming up Millhouse

Real-time collaborative productivity platform with boards, notes, and todos.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui |
| Backend | Convex |
| Auth | Convex Auth (Google OAuth) |
| Hosting | Vercel |
| Runtime | Bun |

## Features

- **Boards** - Real-time whiteboarding with Excalidraw
- **Notes** - Block-based editor with BlockNote
- **Todos** - Personal task management with drag-and-drop
- **Workspaces** - Team collaboration with roles
- **Real-time Sync** - Live collaboration

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.1+
- [Node.js](https://nodejs.org) 20+
- Convex account
- Google OAuth credentials

### Installation

```bash
# Clone repository
git clone https://github.com/AnsarUllahAnasZ360/millhouse-web.git
cd millhouse-web

# Install dependencies
bun install

# Setup Convex
npx convex dev

# Start development server
bun run dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```
CONVEX_DEPLOYMENT=dev:your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

Set Convex environment variables:
```bash
npx convex env set AUTH_GOOGLE_ID <your-google-client-id>
npx convex env set AUTH_GOOGLE_SECRET <your-google-client-secret>
```

## Development

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run lint` | Run linter |
| `bun run typecheck` | Type check |
| `bun run test` | Run unit tests |
| `bun run test:e2e` | Run E2E tests |
| `npx convex dev` | Start Convex dev server |

## Architecture

```
src/
├── app/              # Next.js App Router
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── hooks/           # Custom hooks
└── lib/             # Utilities

convex/              # Backend functions
├── schema.ts        # Database schema
└── auth.ts          # Authentication

tests/
├── unit/            # Unit tests
├── integration/     # Integration tests
└── e2e/             # E2E tests
```

## Documentation

- [Project Charter](./docs/01-PROJECT_CHARTER.md)
- [Tech Stack](./docs/02-TECH_STACK.md)
- [Architecture](./docs/03-ARCHITECTURE.md)
- [Claude Configuration](./docs/05-CLAUDE_INIT.md)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

[MIT](./LICENSE)
