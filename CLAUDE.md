# Millhouse Web

> Everything's coming up Millhouse

Real-time collaborative productivity platform with boards, notes, and todos.

## Commands
```bash
bun run dev          # Dev server (Next.js + Turbopack)
bun run build        # Production build
bun run lint         # Biome check
bun run typecheck    # TypeScript check
bun run test         # Vitest unit tests
npx convex dev       # Convex server (separate terminal)
```

## Stack
- **Frontend**: Next.js 16, React 19, TypeScript strict
- **Backend**: Convex (queries, mutations, real-time)
- **UI**: Tailwind CSS 4, shadcn/ui (new-york, neutral)
- **Auth**: Convex Auth + Google OAuth

## Structure
- `src/app/` - Next.js App Router pages
- `src/components/ui/` - shadcn/ui components
- `convex/` - Backend functions and schema
- `tests/` - Vitest unit, Playwright E2E

## Skills
- **react-best-practices** - Components, performance
- **nextjs-patterns** - Server/client components, routing
- **convex-patterns** - Database, real-time subscriptions
- **tailwind-shadcn** - Styling, UI components
- **test-driven-development** - Tests before code
- **git-workflow** - Commits, branches, PRs

## CLIs
- `bunx shadcn@latest add [name]` - Add component
- `npx convex env set KEY val` - Set env variable
- `vercel deploy` - Deploy to preview
- `gh pr create` - Create PR

## Hooks (Auto-Run on Edit/Write)
1. Biome formats the file
2. TypeScript reports errors

## IMPORTANT
- Server Components by default, "use client" only when needed
- Check auth in mutations: `await getAuthUserId(ctx)`
- NEVER modify: `convex/_generated/`, `node_modules/`, `.next/`

## Commits
```
feat|fix|chore: description

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```
