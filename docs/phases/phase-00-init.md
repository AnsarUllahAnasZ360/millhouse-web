# Phase 0: Project Initialization

> **Version**: 2.0.0
> **Date**: January 19, 2026
> **Status**: Ready for Execution

---

## 1. Objective

Set up the complete development environment, install all dependencies, configure Claude Code, and prepare the repository for Phase 1 implementation.

---

## 2. Deliverables

| # | Deliverable | Owner |
|---|-------------|-------|
| D1 | Local development environment running | Agent |
| D2 | All dependencies installed | Agent |
| D3 | Claude Code fully configured (skills, MCPs, hooks) | Agent + Human |
| D4 | shadcn/ui components initialized | Agent + Human |
| D5 | Project skeleton created | Agent |
| D6 | README.md with banner and documentation | Agent |
| D7 | CLAUDE.md (under 300 words) | Agent |
| D8 | MIT LICENSE | Agent |
| D9 | GitHub repository synced | Agent + Human |
| D10 | Vercel deployment configured | Human + Agent |

---

## 3. Human Inputs Required

Before agent execution, the human must provide:

### 3.1 GitHub Setup

| Item | Action Required |
|------|-----------------|
| Create GitHub repository | Create public repo `millhouse-web` |
| Authenticate GitHub CLI | Run `gh auth login` |
| Provide repo URL | Share the repository URL |

### 3.2 Vercel Setup

| Item | Action Required |
|------|-----------------|
| Create Vercel account | Sign up at vercel.com |
| Authenticate Vercel CLI | Run `vercel login` |
| Link project | Run `vercel link` in project directory |

### 3.3 Convex Setup

| Item | Action Required |
|------|-----------------|
| Create Convex account | Sign up at convex.dev |
| Authenticate Convex CLI | Run `npx convex login` |
| Create project | Will be done during `npx convex dev` |

### 3.4 Google OAuth Setup

| Item | Action Required |
|------|-----------------|
| Create Google Cloud project | console.cloud.google.com |
| Enable OAuth consent screen | Configure for external users |
| Create OAuth credentials | Web application type |
| Provide credentials | CLIENT_ID and CLIENT_SECRET |

### 3.5 Skills Sources

| Skill | Source | Status |
|-------|--------|--------|
| ralph-prd | Already exists in `.claude/skills/ralph-prd/` | ✓ Ready |
| react-best-practices | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) | Install from source |
| agent-browser | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) (plugin) | Install plugin |
| test-driven-development | [obra/superpowers](https://github.com/obra/superpowers) | Install from source |
| git-workflow | [netresearch/claude-code-marketplace](https://github.com/netresearch/claude-code-marketplace) | Install from source |
| nextjs-patterns | Auto-generate based on Next.js 15 App Router | Agent creates |
| convex-patterns | Auto-generate based on Convex docs | Agent creates |
| tailwind-shadcn | Auto-generate based on project config | Agent creates |

### 3.6 shadcn/ui Configuration

| Setting | Value |
|---------|-------|
| Base | radix |
| Style | vega |
| Base Color | neutral |
| Theme | neutral |
| Icon Library | lucide |
| Font | inter |
| Menu Accent | subtle |
| Menu Color | default |
| Radius | default |

Configuration URL: https://ui.shadcn.com/create?base=radix&style=vega&baseColor=neutral&theme=neutral&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=default

### 3.7 README Banner

| Item | Value |
|------|-------|
| Tagline | "Everything's coming up Millhouse" |
| Project logo/banner | To be provided by human (optional) |

---

## 4. Agent Tasks

Tasks the agent will execute autonomously after receiving human inputs:

### 4.1 Repository Initialization

| # | Task | Command/Action |
|---|------|----------------|
| A1 | Initialize Git | `git init` |
| A2 | Create .gitignore | Write Node/Next.js/Convex patterns |
| A3 | Create LICENSE | MIT license |
| A4 | Initial commit | `git add . && git commit` |
| A5 | Add remote | `git remote add origin <url>` |
| A6 | Push to GitHub | `git push -u origin main` |

### 4.2 Package Installation

| # | Task | Command/Action |
|---|------|----------------|
| A7 | Initialize Bun | `bun init` |
| A8 | Install Next.js 15 | `bun add next@latest react@latest react-dom@latest` |
| A9 | Install TypeScript | `bun add -D typescript @types/node @types/react @types/react-dom` |
| A10 | Install Convex | `bun add convex` |
| A11 | Install Convex Auth | `bun add @convex-dev/auth` |
| A12 | Install Tailwind CSS 4 | `bun add tailwindcss` |
| A13 | Install UI utilities | `bun add class-variance-authority clsx tailwind-merge lucide-react` |
| A14 | Install theme/toast | `bun add next-themes sonner` |
| A15 | Install Biome | `bun add -D @biomejs/biome` |
| A16 | Install Vitest | `bun add -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react` |
| A17 | Install Convex test | `bun add -D convex-test` |
| A18 | Install Playwright | `bun add -D @playwright/test` |

### 4.3 Configuration Files

| # | Task | File |
|---|------|------|
| A19 | Create next.config.ts | Next.js configuration |
| A20 | Create tsconfig.json | TypeScript strict mode |
| A21 | Create tailwind.config.ts | Tailwind configuration |
| A22 | Create biome.json | Biome lint/format config |
| A23 | Create vitest.config.ts | Vitest configuration |
| A24 | Create playwright.config.ts | Playwright configuration |
| A25 | Create .env.example | Environment template |

### 4.4 Project Structure

| # | Task | Action |
|---|------|--------|
| A26 | Create src/app structure | App Router pages |
| A27 | Create src/components structure | Component directories |
| A28 | Create src/lib structure | Utility directories |
| A29 | Create src/hooks structure | Custom hooks directory |
| A30 | Create convex/ structure | Backend function directories |
| A31 | Create tests/ structure | Test directories |
| A32 | Create docs/ structure | Documentation directories |

### 4.5 Convex Setup

| # | Task | Command/Action |
|---|------|----------------|
| A33 | Initialize Convex | `npx convex dev` (first run) |
| A34 | Create schema.ts | Database schema |
| A35 | Create auth.ts | Authentication config |
| A36 | Set environment variables | `npx convex env set` |

### 4.6 shadcn/ui Setup

| # | Task | Command/Action |
|---|------|----------------|
| A37 | Initialize shadcn | `bunx shadcn@latest init` |
| A38 | Install button | `bunx shadcn@latest add button` |
| A39 | Install input | `bunx shadcn@latest add input` |
| A40 | Install card | `bunx shadcn@latest add card` |
| A41 | Install dialog | `bunx shadcn@latest add dialog` |
| A42 | Install dropdown-menu | `bunx shadcn@latest add dropdown-menu` |
| A43 | Install avatar | `bunx shadcn@latest add avatar` |
| A44 | Install skeleton | `bunx shadcn@latest add skeleton` |
| A45 | Install separator | `bunx shadcn@latest add separator` |

### 4.7 Claude Code Setup

| # | Task | Action |
|---|------|--------|
| A46 | Create .claude/settings.json | Hooks configuration |
| A47 | Create .mcp.json | MCP server configuration |
| A48 | Install agent-browser plugin | `npm install -g agent-browser && agent-browser install` |
| A49 | Clone react-best-practices skill | From vercel-labs/agent-skills |
| A50 | Clone test-driven-development skill | From obra/superpowers |
| A51 | Clone git-workflow skill | From netresearch/claude-code-marketplace |
| A52 | Create nextjs-patterns skill | Auto-generate |
| A53 | Create convex-patterns skill | Auto-generate |
| A54 | Create tailwind-shadcn skill | Auto-generate |
| A55 | Create CLAUDE.md | Project context (under 300 words) |

### 4.8 MCP Installation

| # | Task | Command |
|---|------|---------|
| A56 | Add Context7 MCP | `claude mcp add context7 -- npx -y @upstash/context7-mcp@latest` |
| A57 | Add Convex MCP | `claude mcp add-json convex '{"type":"stdio","command":"npx","args":["convex","mcp","start"]}'` |
| A58 | Initialize shadcn MCP | `pnpm dlx shadcn@latest mcp init --client claude` |

### 4.9 Documentation

| # | Task | File |
|---|------|------|
| A59 | Create README.md | Project overview, setup, architecture |
| A60 | Create CONTRIBUTING.md | Contribution guidelines |
| A61 | Update docs/ | Ensure all docs are current |

### 4.10 CI/CD Setup

| # | Task | File |
|---|------|------|
| A62 | Create .github/workflows/ci.yml | CI pipeline |
| A63 | Configure Vercel | Link and configure |

### 4.11 Verification

| # | Task | Command |
|---|------|---------|
| A64 | Run dev server | `bun run dev` |
| A65 | Run lint | `bun run lint` |
| A66 | Run typecheck | `bun run typecheck` |
| A67 | Run build | `bun run build` |
| A68 | Verify Convex | `npx convex dev` |
| A69 | Push final changes | `git push` |

---

## 5. Execution Order

### Step 1: Human Inputs (Before Agent Starts)

```
□ 3.1 GitHub Setup
□ 3.2 Vercel Setup
□ 3.3 Convex Setup
□ 3.4 Google OAuth Setup
□ 3.5 Skills Sources
□ 3.6 shadcn/ui Configuration
□ 3.7 README Banner (optional)
```

### Step 2: Agent Execution

```
1. Repository Initialization (A1-A6)
2. Package Installation (A7-A18)
3. Configuration Files (A19-A25)
4. Project Structure (A26-A32)
5. Convex Setup (A33-A36)
6. shadcn/ui Setup (A37-A45)
7. Claude Code Setup (A46-A55)
8. MCP Installation (A56-A58)
9. Documentation (A59-A61)
10. CI/CD Setup (A62-A63)
11. Verification (A64-A69)
```

---

## 6. Success Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| SC1 | `bun run dev` starts without errors | Manual |
| SC2 | `bun run build` completes successfully | Manual |
| SC3 | `bun run lint` passes | Manual |
| SC4 | `bun run typecheck` passes | Manual |
| SC5 | Convex dashboard shows project | Manual |
| SC6 | GitHub repository has all files | Manual |
| SC7 | Vercel shows deployment | Manual |
| SC8 | All skills are installed | `ls .claude/skills/` |
| SC9 | MCPs are configured | `claude mcp list` |
| SC10 | README.md is complete | Manual review |

---

## 7. Files Created

```
millhouse-web/
├── .claude/
│   ├── settings.json
│   └── skills/
│       ├── ralph-prd/SKILL.md              # Already exists
│       ├── react-best-practices/SKILL.md   # From vercel-labs
│       ├── test-driven-development/SKILL.md # From obra/superpowers
│       ├── git-workflow/SKILL.md           # From netresearch
│       ├── nextjs-patterns/SKILL.md        # Auto-generated
│       ├── convex-patterns/SKILL.md        # Auto-generated
│       └── tailwind-shadcn/SKILL.md        # Auto-generated
├── .github/
│   └── workflows/
│       └── ci.yml
├── .ralph-tui/
│   └── config.toml
├── convex/
│   ├── schema.ts
│   └── auth.ts
├── docs/
│   └── (existing docs)
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── ui/
│   ├── hooks/
│   └── lib/
│       └── utils.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .env.local
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

## 8. README.md Structure

```markdown
# Millhouse Web

[Banner Image]

> [Tagline from human input]

## Overview

Brief description of the project.

## Tech Stack

Table of technologies.

## Architecture

High-level diagram.

## Getting Started

Setup instructions.

## Development

Commands and workflows.

## Documentation

Links to docs.

## Contributing

Link to CONTRIBUTING.md.

## License

MIT
```

---

## 9. CLAUDE.md Template (Under 300 Words)

```markdown
# Millhouse Web

> Everything's coming up Millhouse

Real-time collaborative productivity platform with boards, notes, and todos.

## Stack
Next.js 15, React 19, TypeScript, Convex, Tailwind CSS 4, shadcn/ui (vega), Bun

## Commands
- `bun run dev` - Development
- `bun run build` - Production build
- `bun run test` - Unit tests
- `bun run test:e2e` - E2E tests
- `bun run lint` - Linting
- `bun run typecheck` - Type check
- `npx convex dev` - Convex server

## Structure
- `src/app/` - Next.js pages
- `src/components/` - React components
- `src/components/ui/` - shadcn/ui (vega style, neutral, inter font)
- `convex/` - Backend functions
- `tests/` - Test files

## Skills
ralph-prd, react-best-practices, test-driven-development, git-workflow, nextjs-patterns, convex-patterns, tailwind-shadcn

## MCPs
Context7 (docs), Convex (database), shadcn/ui (components)

## CLIs
Bun, Next.js, Convex, Vercel, GitHub, Playwright, Biome, agent-browser

## Conventions
- TypeScript strict mode
- Biome for lint/format
- Conventional commits
- TDD approach

## Do Not Touch
- convex/_generated/
- node_modules/
- .next/
```

---

*Document Version: 2.0.0 | January 19, 2026*
