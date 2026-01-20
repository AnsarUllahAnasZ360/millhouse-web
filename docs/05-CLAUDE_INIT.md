# Millhouse Web - Claude Code Configuration

> **Version**: 2.0.0
> **Date**: January 19, 2026

---

## 1. CLI Tools

### 1.1 Native CLIs (No Auth Required)

| CLI | Commands | Package |
|-----|----------|---------|
| Bun | `bun`, `bunx`, `bun run` | Pre-installed |
| Next.js | `next dev`, `next build`, `next start` | `next` |
| Turbopack | `next dev --turbopack`, `next build --turbopack` | Integrated in Next.js |
| TypeScript | `tsc --noEmit` | `typescript` |
| Biome | `biome check`, `biome format`, `biome lint` | `@biomejs/biome` |
| Playwright | `npx playwright test`, `npx playwright codegen` | `@playwright/test` |
| Vitest | `npx vitest`, `npx vitest --coverage` | `vitest` |

### 1.2 Remote CLIs (Auth Required)

| CLI | Auth Command | Key Commands |
|-----|--------------|--------------|
| GitHub CLI | `gh auth login` | `gh pr create`, `gh issue list`, `gh workflow run` |
| Vercel CLI | `vercel login` | `vercel`, `vercel --prod`, `vercel env pull` |
| Convex CLI | `npx convex login` | `npx convex dev`, `npx convex deploy`, `npx convex env set` |
| Stripe CLI | `stripe login` | `stripe listen`, `stripe trigger`, `stripe logs tail` |
| Sentry CLI | `sentry-cli login` | `sentry-cli releases new`, `sentry-cli sourcemaps upload` |
| PostHog CLI | `posthog-cli login` | `posthog-cli sourcemap` |
| Greptile CLI | `greptile auth` | `greptile add`, `greptile start`, `greptile list` |

---

## 2. MCP Servers

| MCP | Purpose | Install |
|-----|---------|---------|
| Context7 | Real-time docs for Next.js, React, Convex, Tailwind | `claude mcp add context7 -- npx -y @upstash/context7-mcp@latest` |
| Convex | Database introspection, queries, tables | `claude mcp add-json convex '{"type":"stdio","command":"npx","args":["convex","mcp","start"]}'` |
| shadcn/ui | Component registry, props, code | `claude mcp add --transport http shadcn https://www.shadcn.io/api/mcp` |

### .mcp.json

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "convex": {
      "command": "npx",
      "args": ["convex", "mcp", "start"]
    },
    "shadcn": {
      "transport": "http",
      "url": "https://www.shadcn.io/api/mcp"
    }
  }
}
```

---

## 3. Skills

| Skill | Source | Trigger | Purpose |
|-------|--------|---------|---------|
| ralph-prd | Local (exists) | PRD, requirements, stories | PRD creation for Ralph loops |
| react-best-practices | vercel-labs/agent-skills | React, hooks, components | React best practices |
| agent-browser | vercel-labs/agent-browser | Agent Browser, E2E, browser test | Plugin for browser automation |
| test-driven-development | obra/superpowers | test, TDD, vitest | Test writing conventions |
| git-workflow | netresearch/claude-code-marketplace | commit, PR, branch | Git conventions |
| nextjs-patterns | Auto-generate | Next.js, App Router, RSC | Server/Client components, routing |
| convex-patterns | Auto-generate | Convex, queries, mutations | Database patterns, real-time |
| tailwind-shadcn | Auto-generate | Tailwind, shadcn, styling | UI component patterns (vega style) |

---

## 4. Rules

| Rule | Purpose |
|------|---------|
| security | No secrets in code, use env vars, validate input, check auth |
| code-style | TypeScript strict, prefer const, one component per file |
| testing | Write tests for Convex functions, E2E for critical paths |
| convex-auth | Always check auth in Convex functions |

---

## 5. Hooks

| Hook | Trigger | Action |
|------|---------|--------|
| biome-format | PostToolUse (Edit/Write) | Auto-format with Biome |
| typecheck | PostToolUse (Edit/Write) | TypeScript check, notify on errors |

### .claude/settings.json

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "if [ -f biome.json ]; then biome format --write \"$CLAUDE_TOOL_ARG_file_path\" 2>/dev/null || true; fi"
          },
          {
            "type": "command",
            "command": "tsc --noEmit 2>&1 | head -20 || true"
          }
        ]
      }
    ]
  }
}
```

---

## 6. Commands

| Command | Purpose |
|---------|---------|
| /plan | Create implementation plan |
| /e2e | Generate E2E test with Agent Browser |

---

## 7. CLAUDE.md Contents

The root CLAUDE.md should contain:

| Section | Contents |
|---------|----------|
| Project Overview | One-liner description of Millhouse Web |
| Tech Stack | Core technologies (Next.js, Convex, etc.) |
| Commands | Dev, build, test, lint commands |
| Structure | Key directories (src/app, convex, tests) |
| Conventions | Code style, commit format |
| Available Skills | List of skills agent can invoke |
| Available MCPs | Context7, Convex, shadcn/ui |
| Available CLIs | All CLI tools agent can use |
| Testing | Test commands, coverage expectations |
| Do Not Touch | Files/areas to avoid modifying |

---

## 8. Directory Structure

```
.claude/
├── settings.json
└── skills/
    ├── ralph-prd/                  # Local (exists)
    ├── react-best-practices/       # vercel-labs/agent-skills
    ├── agent-browser/              # vercel-labs/agent-browser
    ├── test-driven-development/    # obra/superpowers
    ├── git-workflow/               # netresearch/claude-code-marketplace
    ├── nextjs-patterns/            # Auto-generate
    ├── convex-patterns/            # Auto-generate
    └── tailwind-shadcn/            # Auto-generate

.mcp.json
CLAUDE.md
```

---

*Document Version: 2.0.0 | January 19, 2026*
