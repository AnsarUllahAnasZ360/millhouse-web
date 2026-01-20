# COLLAB + MILLHOUSE: Unified Project Proposal

> **Version**: 1.0.0
> **Date**: January 18, 2026
> **Authors**: Ansar & Claude (Co-Authors)
> **Codename**: "The Software Factory"

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Vision & Philosophy](#2-vision--philosophy)
3. [The Problem Space](#3-the-problem-space)
4. [Project Phases Overview](#4-project-phases-overview)
5. [Phase 1: Millhouse CLI](#5-phase-1-millhouse-cli)
6. [Phase 2: Collab Platform](#6-phase-2-collab-platform)
7. [Phase 3: Millhouse GUI](#7-phase-3-millhouse-gui)
8. [Complete Tech Stack](#8-complete-tech-stack)
9. [Architecture Diagrams](#9-architecture-diagrams)
10. [Feature Specifications](#10-feature-specifications)
11. [Dependencies & Integrations](#11-dependencies--integrations)
12. [Competitive Analysis](#12-competitive-analysis)
13. [Implementation Roadmap](#13-implementation-roadmap)
14. [Risk Assessment](#14-risk-assessment)
15. [My Commentary & Recommendations](#15-my-commentary--recommendations)
16. [Naming Suggestions](#16-naming-suggestions)
17. [Research Sources](#17-research-sources)

---

## 1. Executive Summary

### What Are We Building?

A **unified software development ecosystem** consisting of three interconnected products:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          THE COLLAB ECOSYSTEM                                │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: Millhouse CLI (Standalone Tool)
════════════════════════════════════════
A local CLI that wraps Claude Code + Ralph TUI + Agent Browser
• Interview-driven PRD generation
• Autonomous code execution loops
• Works with YOUR Claude Pro/Max subscription
• No API keys required

PHASE 2: Collab Platform (Web Application)
════════════════════════════════════════════
A productivity suite for teams
• Whiteboarding (Excalidraw)
• Note-taking (BlockNote)
• Personal todo management
• Workspace collaboration
• Real-time sync

PHASE 3: Millhouse GUI (Integrated Experience)
══════════════════════════════════════════════
Software factory in the browser
• Project-based AI development
• Kanban task management → AI execution
• Daytona sandboxed containers
• Real-time execution monitoring
• Full lifecycle: Idea → PRD → Code → Test → Deploy
```

### The Core Thesis

> **"In the future, people will pay for OWNED software instead of RENTED software (SaaS). The economics have shifted. Building things will not be expensive anymore."**

AI coding agents have reached an inflection point. The **Ralph Loop** pattern enables truly autonomous software development:

```javascript
while (true) {
    spawn_fresh_ai_agent()
    give_it_the_PRD()
    let_it_work()
    if (all_tasks_complete) break
}
```

**Memory doesn't live in the AI's context window. It lives in files, git history, and progress trackers.**

### Why Now?

- **Ralph Loop emerged December 2025** - enabling true autonomous development
- **Claude Code, Cursor, Windsurf maturing rapidly** - AI coding is production-ready
- **AI coding costs dropping exponentially** - accessible to everyone
- **SMBs spending $10K+/year on SaaS** - clear pain point and market opportunity

**Verdict: 2-3 year FIRST MOVER ADVANTAGE, not "ahead of time"**

---

## 2. Vision & Philosophy

### Design Philosophy

1. **Minimal & Clean** - OpenAI-style UX, no bloat
2. **AI-First Development** - Humans architect, AI executes
3. **Open Source by Default** - MIT license, portfolio project
4. **Battle-Tested Foundations** - Leverage existing open-source (Excalidraw, BlockNote)
5. **Mobile-Optimized** - PWA for access anywhere
6. **Real-Time Collaboration** - Everything syncs instantly

### Target Users

**Phase 1 (CLI)**: Developers who want autonomous coding loops
**Phase 2 (Collab)**: Teams needing lightweight productivity tools
**Phase 3 (GUI)**: Non-technical founders, product managers, and developers who want GUI-based AI development

### The Analogy

- **Ralph** = The AI agents (the labor)
- **Millhouse** = The average software developer (the majority)
- **You (Ansar)** = The architect, manager, boss

The goal: **Empower the average developer** by providing a framework that enforces best practices and automates the tedious parts.

---

## 3. The Problem Space

### The SaaS Problem

A typical small business needs:
- Workspace management
- Communications (internal + client)
- CRM
- Operations management
- HR & productivity tools
- Finances & payroll
- Marketing management
- Project tracking
- Scheduling & billing

**Result**:
- 5-10+ subscriptions
- $5,000-$15,000/month
- Tools that don't integrate well
- "Working for the software instead of software working for them"

### The Productivity Problem

Teams struggle with:
- **Scattered thoughts** - Ideas in email, Slack, notebooks
- **Poor documentation** - Knowledge lives in people's heads
- **No single source of truth** - Multiple disconnected tools
- **Expensive alternatives** - Notion, Linear, Asana add up quickly

### The AI Development Problem

Current AI coding tools:
- **Chat interfaces** - Good for simple tasks, not complex projects
- **No process enforcement** - Easy to build spaghetti code
- **Context window limits** - Can't handle large features
- **No quality gates** - No automatic testing/linting

---

## 4. Project Phases Overview

### Phase 1: Millhouse CLI

**Timeline**: Current focus - 1 week sprint
**Status**: Development in progress
**Goal**: Local, standalone CLI for autonomous AI development

```
┌────────────────────────────────────────────────────────────────┐
│                        MILLHOUSE CLI                           │
│                                                                │
│  Input: "I want to build a password reset feature"            │
│                            ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  SCREAM → RESOURCES → INTERVIEW → PRD → EXECUTE → DONE  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            ↓                                   │
│  Output: Working, tested code in a PR                         │
│                                                                │
│  Powered by: Claude Code CLI + Ralph TUI + Agent Browser      │
└────────────────────────────────────────────────────────────────┘
```

### Phase 2: Collab Platform

**Timeline**: After Phase 1
**Goal**: Web-based productivity suite for teams

```
┌────────────────────────────────────────────────────────────────┐
│                       COLLAB PLATFORM                          │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   BOARDS     │  │    NOTES     │  │       TODOS          │ │
│  │ (Excalidraw) │  │ (BlockNote)  │  │  (Personal Tasks)    │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│                                                                │
│  Features:                                                     │
│  • Multi-workspace support                                     │
│  • User authentication                                         │
│  • Real-time collaboration                                     │
│  • Collections & organization                                  │
│  • Activity logging                                            │
│  • Global search                                               │
│  • Notifications                                               │
└────────────────────────────────────────────────────────────────┘
```

### Phase 3: Millhouse GUI

**Timeline**: After Phase 2
**Goal**: Full software factory in the browser

```
┌────────────────────────────────────────────────────────────────┐
│                       MILLHOUSE GUI                            │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    PROJECT KANBAN                         │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐ │ │
│  │  │  IDEAS  │ │PLANNING │ │ RUNNING │ │    TESTING      │ │ │
│  │  │         │ │         │ │         │ │                 │ │ │
│  │  │ Card 1  │ │ Card 2  │ │ Card 3  │ │    Card 4       │ │ │
│  │  │ Card 5  │ │ Card 6  │→│ ████░░░ │→│ Auto-testing... │ │ │
│  │  │         │ │         │ │ 65%     │ │                 │ │ │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Lifecycle: Idea → PRD Chat → Approve → Run → Test → Deploy   │
│  Powered by: Daytona containers + Claude Code + Ralph TUI     │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Phase 1: Millhouse CLI

### Core Modes

#### 1. Plan Mode (`milhouse plan`)

```
User: "I want to add a password reset feature"
                    ↓
    ┌───────────────────────────────────┐
    │       STEP 1: SCREAM PHASE        │
    │  User describes what they want    │
    │  in natural language              │
    └───────────────────────────────────┘
                    ↓
    ┌───────────────────────────────────┐
    │       CLAUDE ANALYZES             │
    │  • Scans codebase                 │
    │  • Identifies relevant files      │
    │  • Understands patterns           │
    └───────────────────────────────────┘
                    ↓
    ┌───────────────────────────────────┐
    │     STEP 2: RESOURCES PHASE       │
    │  User confirms/adds:              │
    │  • Files to reference             │
    │  • Documentation URLs             │
    │  • External resources             │
    └───────────────────────────────────┘
                    ↓
    ┌───────────────────────────────────┐
    │      STEP 3: INTERVIEW PHASE      │
    │  Claude asks contextual questions │
    │                                   │
    │  Intensity levels:                │
    │  • Chill: 5-7 questions           │
    │  • Thorough: 10-15 questions      │
    │  • Comprehensive: 20+ questions   │
    └───────────────────────────────────┘
                    ↓
    ┌───────────────────────────────────┐
    │         PRD GENERATION            │
    │  Structured PRD with:             │
    │  • User stories                   │
    │  • Acceptance criteria            │
    │  • File dependencies              │
    │  • Quality gates                  │
    └───────────────────────────────────┘
                    ↓
    ┌───────────────────────────────────┐
    │       AUTO-CONFIGURATION          │
    │  • Convert PRD to JSON tracker    │
    │  • Generate Ralph TUI config      │
    │  • Create git worktree            │
    │  • Session ready to execute       │
    └───────────────────────────────────┘
```

#### 2. Run Mode (`milhouse run <session>`)

- Executes sessions through Ralph TUI
- Real-time progress monitoring
- Detach/attach capability
- Quality gates after each story

#### 3. Review Mode (`milhouse review <PR#>`)

- Nested execution (loop within loop)
- Analyze → Fix → Test → Document
- Agent Browser for E2E testing
- Presets: minimum, standard, thorough, complete

### Key Innovation: Interview-Driven PRD

**No other tool does this.** The interview process:

1. **Contextual questions** based on codebase analysis
2. **Multiple question types**: text, choice, multiselect
3. **Category-aware**: scope, behavior, edge cases, technical, UX
4. **Intensity levels** for different project sizes

### Authentication Model

**Critical**: Millhouse uses Claude Code CLI via subprocess, NOT the Agent SDK.

| Method | Subscription Auth | API Key Auth |
|--------|-------------------|--------------|
| Claude Agent SDK | NO | YES |
| Claude Code CLI (subprocess) | YES | YES |

**Users can use their Claude Pro/Max subscription - no API key required!**

---

## 6. Phase 2: Collab Platform

### Core Features

#### 1. Authentication & Workspaces

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORKSPACE MODEL                               │
│                                                                  │
│  User signs up → Creates Workspace → Invites Team Members        │
│                                                                  │
│  • User can have multiple workspaces                             │
│  • Workspace has admins and members                              │
│  • Invitation system (link or email)                             │
│  • Role-based permissions                                        │
└─────────────────────────────────────────────────────────────────┘
```

#### 2. Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                      DASHBOARD LAYOUT                            │
│                                                                  │
│  ┌───────────────────────────────┬─────────────────────────────┐│
│  │                               │                              ││
│  │     RECENT ACTIVITY           │       MY TODOS               ││
│  │                               │                              ││
│  │  • John edited "System        │  □ Review PRD for auth       ││
│  │    Design" board              │  □ Update wireframes         ││
│  │  • Sarah created note         │  ☑ Schedule team meeting     ││
│  │    "API Endpoints"            │  □ Write documentation       ││
│  │  • Mike commented on          │                              ││
│  │    "Architecture" board       │  [+ Add Todo]                ││
│  │                               │                              ││
│  └───────────────────────────────┴─────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                  RECENT ITEMS                                ││
│  │                                                              ││
│  │  📋 System Design Board    📝 API Notes    📋 Roadmap       ││
│  │  📝 Meeting Notes          📋 Wireframes   📝 Research       ││
│  │                                                              ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

#### 3. Boards (Excalidraw)

- Full whiteboarding capability
- Real-time collaboration
- Powered by `@excalidraw/excalidraw` npm package
- Collaboration via `excalidraw-room` WebSocket server

#### 4. Notes (BlockNote)

- Notion-style block editing
- Rich markdown support
- AI assistance integration (BlockNote AI)
- Export to markdown

#### 5. Personal Todos

```
┌─────────────────────────────────────────────────────────────────┐
│                       TODO SYSTEM                                │
│                                                                  │
│  Design Philosophy:                                              │
│  • Individual to user (not shared)                               │
│  • Simple checkbox interface                                     │
│  • Completed tasks stay visible for the day                      │
│  • Then moved to history (still accessible)                      │
│  • Expandable for details                                        │
│  • Quick add via shortcut                                        │
│                                                                  │
│  Implementation: Could be a configured version of Notes          │
│  using BlockNote with a custom todo schema                       │
└─────────────────────────────────────────────────────────────────┘
```

#### 6. Collections & Organization

- Group related boards and notes
- Public, private, or shared visibility
- Favorites system
- Nested collections support

#### 7. Additional Features

- **Global Search** - Command-K style search across all content
- **Activity Logging** - Detailed workspace activity
- **Comments & Mentions** - Collaborate on specific items
- **Notifications** - Real-time notification system

---

## 7. Phase 3: Millhouse GUI

### The Vision: Software Factory in the Browser

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MILLHOUSE GUI FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

1. CREATE PROJECT
   └─→ Name, description, connect GitHub repo
   └─→ Configure: stack, testing strategy, runtime, hosting
   └─→ Add CLAUDE.md context for the AI

2. CREATE TASK (Kanban Card)
   └─→ Ideas stage: Quick thought capture
   └─→ Planning stage: Chat with AI to develop PRD
       • Select task type: Feature, Bug, Review, Task
       • AI interviews you based on type
       • AI prepares structured PRD
       • You review and approve

3. EXECUTION (Automatic)
   └─→ Card moves to "Running" stage
   └─→ Daytona spins up container
   └─→ Clone repo, create branch, create worktree
   └─→ Install dependencies
   └─→ Ralph Loop executes PRD
   └─→ Real-time logs stream to UI

4. TESTING (Auto or Manual)
   └─→ If auto-testing enabled: AI runs test suite
   └─→ AI review of changes
   └─→ Card moves to "Review" stage

5. COMPLETION
   └─→ PR created automatically
   └─→ Human reviews and merges
   └─→ Card moves to "Done"
```

### Managing AI Subscriptions

**Critical Innovation**: Using subsidized Claude Pro/Max subscriptions instead of expensive API credits.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUBSCRIPTION MANAGEMENT                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Problem:
• $1,000 in API credits ≈ limited usage
• 5 Claude Pro licenses ($100/month) ≈ equivalent of $3,000-$5,000 API usage

Solution:
• Workspace gets dedicated mailbox
• System manages Claude account creation/login
• When container starts:
  1. Check available accounts (not rate-limited)
  2. Authenticate via magic link or password
  3. Use that account for the session
• If all accounts busy: Queue or alert user

User Settings:
• Add multiple AI accounts
• Configure backup accounts
• View usage/status of each
• Get alerts when accounts need attention
```

### Integration with Collab

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COLLAB ↔ MILLHOUSE INTEGRATION                            │
└─────────────────────────────────────────────────────────────────────────────┘

• Move a Note → Becomes task context in Millhouse project
• Move a Board → Becomes visual spec for a task
• Shared permissions model
• Unified search across both
• Same workspace, same team members
```

---

## 8. Complete Tech Stack

### Primary Stack

| Category | Technology | Version | Rationale |
|----------|------------|---------|-----------|
| **Frontend Framework** | Next.js (App Router) | 15+ | AI knows it extremely well, mature ecosystem, Vercel optimization |
| **Language** | TypeScript | 5.x | End-to-end type safety |
| **UI Components** | shadcn/ui | Latest | Accessible, customizable, AI-friendly |
| **Styling** | Tailwind CSS | 4.x | Utility-first, rapid development |
| **Backend/Database** | Convex | Latest | Real-time by default, TypeScript everywhere, no backend code for CRUD |
| **Authentication** | Better Auth or Convex Auth | Latest | Better Auth for flexibility; Convex Auth for simplicity |
| **Hosting** | Vercel | - | Zero-config for Next.js |
| **Runtime/Package Manager** | Bun | 1.x | Fast, TypeScript-native |

### Secondary Stack (Features)

| Category | Technology | Rationale |
|----------|------------|-----------|
| **Whiteboarding** | Excalidraw (@excalidraw/excalidraw) | MIT license, battle-tested, great API |
| **Real-time Whiteboard Sync** | excalidraw-room | Official collaboration server |
| **Note Editor** | BlockNote | Notion-style, React-native, extensible |
| **Payments** | Stripe | Industry standard, Convex component available |
| **Documentation** | Fumadocs | Beautiful, Next.js native, AI-friendly |
| **PWA** | Capacitor | Best mobile experience, can use PWA fallback |
| **AI Integration** | Vercel AI SDK + LangGraph | Vercel for streaming UI, LangGraph for complex workflows |

### Testing Stack

| Type | Technology | Rationale |
|------|------------|-----------|
| **Unit Testing** | Vitest | Fast, TypeScript-native, matches Next.js ecosystem |
| **E2E Testing** | Playwright | Cross-browser, reliable, official Next.js recommendation |
| **Convex Testing** | convex-test | Official library for testing Convex functions |
| **Type Checking** | TypeScript (tsc) | Built-in |

### Code Quality

| Tool | Purpose | Rationale |
|------|---------|-----------|
| **Linting & Formatting** | Biome | 20x faster than ESLint+Prettier, unified config |
| **Fallback Linting** | ESLint | For plugins Biome doesn't support yet |

### Infrastructure (Phase 3)

| Category | Technology | Rationale |
|----------|------------|-----------|
| **AI Sandbox** | Daytona | Sub-200ms container startup, secure isolation, OCI compatible |
| **AI Coding Agent** | Claude Code CLI | Subscription auth support, proven in production |
| **Loop Orchestration** | Ralph TUI | Battle-tested autonomous loop pattern |
| **E2E Testing** | Agent Browser CLI | Visual verification in loops |

### Why These Choices?

#### Convex over Supabase

| Aspect | Convex | Supabase |
|--------|--------|----------|
| Real-time | Built-in (automatic) | Add-on (manual setup) |
| Learning Curve | New patterns | Familiar SQL |
| Type Safety | Automatic end-to-end | Manual effort |
| Latency | Sub-50ms at 5K connections | 100-200ms p99 under load |

**Verdict**: Collab needs real-time everywhere. Convex makes this trivial.

#### Next.js over TanStack Start

```
AI TRAINING DATA REALITY:

NEXT.JS:
• 10+ years of Stack Overflow answers
• Millions of GitHub repos
• Every AI model has seen Next.js extensively
• "Create a dashboard" → AI knows exactly what to do

TANSTACK START:
• Release Candidate since late 2025
• Limited production codebases
• AI may struggle with newer patterns
```

**Verdict**: For AI-first development, Next.js wins on familiarity.

#### Better Auth over Clerk

| Aspect | Better Auth | Clerk |
|--------|-------------|-------|
| Cost | Free (open source) | Paid (scales with MAU) |
| Data Ownership | Your database | Their servers |
| Customization | Full control | Limited |
| Setup Time | Moderate | Very fast |

**Verdict**: Better Auth for full control and cost savings at scale. Convex Auth acceptable for simpler needs.

#### Biome over ESLint + Prettier

- **20x faster** linting and formatting
- **One config file** instead of four
- **One binary** instead of 127+ npm packages
- **Migration command** from ESLint/Prettier

**Verdict**: Biome for new projects, hybrid for complex existing setups.

---

## 9. Architecture Diagrams

### Phase 2: Collab Platform Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER'S BROWSER                                  │
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │                    Next.js Application (Vercel)                     │    │
│   │                                                                      │    │
│   │   ┌─────────────┐   ┌─────────────┐   ┌────────────────────────┐   │    │
│   │   │   Pages     │   │ Components  │   │   Feature Wrappers     │   │    │
│   │   │             │   │             │   │                        │   │    │
│   │   │ /dashboard  │   │ shadcn/ui   │   │ ExcalidrawWrapper      │   │    │
│   │   │ /boards     │   │ Custom UI   │   │ BlockNoteWrapper       │   │    │
│   │   │ /notes      │   │             │   │ TodoWrapper            │   │    │
│   │   │ /settings   │   │             │   │                        │   │    │
│   │   └─────────────┘   └─────────────┘   └────────────────────────┘   │    │
│   │          │                                      │         │         │    │
│   └──────────┼──────────────────────────────────────┼─────────┼─────────┘    │
│              │                                      │         │              │
└──────────────┼──────────────────────────────────────┼─────────┼──────────────┘
               │                                      │         │
               │ Convex Client                        │         │ Socket.IO
               │ (queries, mutations)                 │         │ (WebSocket)
               │                                      │         │
               ▼                                      │         ▼
┌──────────────────────────────────┐                  │   ┌──────────────────────────┐
│          CONVEX BACKEND          │                  │   │    EXCALIDRAW-ROOM       │
│                                  │                  │   │  (Cloud Run / Railway)   │
│  ┌────────────┐ ┌────────────┐   │                  │   │                          │
│  │  Database  │ │  Functions │   │                  │   │  Socket.IO Server        │
│  │            │ │            │   │                  │   │  - Real-time cursors     │
│  │  users     │ │  queries/  │   │                  │   │  - Element sync          │
│  │  workspaces│ │  mutations │   │                  │   │  - Room management       │
│  │  boards    │ │  auth.ts   │   │                  │   │                          │
│  │  notes     │ │            │   │                  │   │  Ephemeral (no storage)  │
│  │  todos     │ │            │   │                  │   └──────────────────────────┘
│  │  activity  │ │            │   │                  │
│  └────────────┘ └────────────┘   │                  │
│                                  │                  │
│  ┌────────────┐ ┌────────────┐   │                  │
│  │   Storage  │ │ Better Auth│   │                  │
│  │            │ │ / Convex   │   │                  │
│  │  Board JSON│ │  Auth      │   │                  │
│  │  Thumbnails│ │            │   │                  │
│  │  Assets    │ │  Google    │   │                  │
│  └────────────┘ └────────────┘   │                  │
│                                  │◄─────────────────┘
│                                  │  Board save (debounced)
└──────────────────────────────────┘
```

### Phase 3: Millhouse GUI Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MILLHOUSE GUI ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────────────────────┘

                             USER'S BROWSER
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
    ┌───────────┐           ┌───────────┐           ┌───────────┐
    │  Next.js  │           │  Next.js  │           │  Next.js  │
    │ /projects │           │  /kanban  │           │ /execution│
    └─────┬─────┘           └─────┬─────┘           └─────┬─────┘
          │                       │                       │
          └───────────────────────┼───────────────────────┘
                                  │
                                  │  Convex React hooks
                                  ▼
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║                              CONVEX                                      ║
    ║                                                                          ║
    ║  DATA: Organizations, Users, Projects, Tasks, Executions, Logs,          ║
    ║        PRDs, AIAccounts, Deployments                                     ║
    ║                                                                          ║
    ║  FUNCTIONS: Queries (auto-sync), Mutations, HTTP Actions                 ║
    ║                                                                          ║
    ║  BUILT-IN: Auth, File Storage, Scheduled Jobs, Real-time                 ║
    ╚═════════════════════════════════════════════════════════════════════════╝
                                  │
                                  │  HTTP Actions / Webhooks
                                  ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                         DAYTONA API                                      │
    │  • Spin up sandbox containers    • Clone repositories                   │
    │  • Execute MillHouse CLI         • Stream logs back                     │
    │  • Authenticate AI accounts      • Manage sessions                      │
    └────────────────────────────────┬────────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
   ┌───────────────┐          ┌───────────────┐          ┌───────────────┐
   │   SANDBOX 1   │          │   SANDBOX 2   │          │   SANDBOX N   │
   │               │          │               │          │               │
   │ • MillHouse   │          │ • MillHouse   │          │ • MillHouse   │
   │   CLI         │          │   CLI         │          │   CLI         │
   │ • Claude Code │          │ • Claude Code │          │ • Claude Code │
   │ • Ralph TUI   │          │ • Ralph TUI   │          │ • Ralph TUI   │
   │ • Agent       │          │ • Agent       │          │ • Agent       │
   │   Browser     │          │   Browser     │          │   Browser     │
   │               │          │               │          │               │
   │ Streams logs ─┼──────────┼───────────────┼──────────┼──► Convex     │
   └───────────────┘          └───────────────┘          └───────────────┘
```

### Real-Time Data Flow

```
Sandbox                      Convex                       Browser
   │                           │                             │
   │  POST /api/log            │                             │
   │  ─────────────────────►   │                             │
   │                           │                             │
   │                      Mutation runs                      │
   │                           │                             │
   │                           │  Subscription triggers      │
   │                           │  ─────────────────────────► │
   │                           │                             │
   │                           │               UI auto-updates!
   │                           │               New log appears
```

---

## 10. Feature Specifications

### Phase 2: Collab Features

#### Authentication

```typescript
// User model
interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
}

// Workspace model
interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  settings: WorkspaceSettings;
  createdAt: Date;
}

// Membership model
interface WorkspaceMember {
  workspaceId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
}
```

#### Boards (Excalidraw)

```typescript
interface Board {
  id: string;
  workspaceId: string;
  name: string;
  ownerId: string;

  // Storage
  dataFileId?: string;  // Convex file storage
  thumbnailFileId?: string;

  // Collaboration
  roomId: string;  // excalidraw-room ID

  // Visibility
  visibility: 'private' | 'workspace' | 'public';
  shareToken?: string;

  // Organization
  collectionId?: string;
  isFavorite: boolean;

  // Metadata
  elementCount: number;
  lastEditedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Notes (BlockNote)

```typescript
interface Note {
  id: string;
  workspaceId: string;
  title: string;
  ownerId: string;

  // Content
  content: string;  // BlockNote JSON

  // Visibility
  visibility: 'private' | 'workspace' | 'public';
  shareToken?: string;

  // Organization
  collectionId?: string;
  isFavorite: boolean;

  // Metadata
  wordCount: number;
  lastEditedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Todos

```typescript
interface Todo {
  id: string;
  userId: string;  // Personal, not workspace-level
  workspaceId: string;  // Context for filtering

  content: string;
  completed: boolean;
  completedAt?: Date;

  // Optional expansion
  details?: string;  // Markdown

  createdAt: Date;
  updatedAt: Date;
}
```

#### Collections

```typescript
interface Collection {
  id: string;
  workspaceId: string;
  name: string;
  ownerId: string;

  // Hierarchy
  parentId?: string;

  // Visibility
  visibility: 'private' | 'workspace';

  createdAt: Date;
}
```

### Phase 3: Millhouse GUI Features

#### Project Configuration

```typescript
interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;

  // GitHub
  repoUrl: string;
  defaultBranch: string;

  // Configuration
  config: ProjectConfig;

  // Status
  status: 'active' | 'archived';

  createdAt: Date;
  updatedAt: Date;
}

interface ProjectConfig {
  stack: string[];  // e.g., ['next.js', 'typescript', 'convex']
  testingStrategy: {
    unit: string;     // e.g., 'vitest'
    e2e: string;      // e.g., 'playwright'
  };
  runtime: string;    // e.g., 'bun'
  packageManager: string;  // e.g., 'bun'
  hosting?: string;   // e.g., 'vercel'
  qualityGates: string[];  // e.g., ['typecheck', 'test', 'lint']
}
```

#### Task (Kanban Card)

```typescript
interface Task {
  id: string;
  projectId: string;

  // Content
  title: string;
  type: 'feature' | 'bug' | 'task' | 'review';
  description?: string;

  // PRD (generated)
  prdContent?: string;  // Markdown
  prdApproved: boolean;
  prdApprovedAt?: Date;

  // Kanban
  stage: 'ideas' | 'planning' | 'ready' | 'running' | 'testing' | 'review' | 'done';
  position: number;

  // Assignment
  assigneeId?: string;

  // Execution
  executionId?: string;

  createdAt: Date;
  updatedAt: Date;
}
```

#### Execution

```typescript
interface Execution {
  id: string;
  taskId: string;
  projectId: string;

  // Daytona
  sandboxId: string;

  // Status
  status: 'starting' | 'running' | 'completed' | 'failed' | 'cancelled';

  // Progress
  progress: {
    totalStories: number;
    completedStories: number;
    currentStory?: string;
    currentIteration: number;
  };

  // Git
  branchName: string;
  baseCommit: string;

  // Timing
  startedAt: Date;
  completedAt?: Date;

  // Result
  pullRequestUrl?: string;
}
```

#### AI Account Management

```typescript
interface AIAccount {
  id: string;
  workspaceId: string;

  // Account details
  provider: 'anthropic' | 'openai';
  email: string;
  passwordEncrypted: string;  // Or magic link mechanism

  // Status
  status: 'available' | 'in_use' | 'rate_limited' | 'needs_attention';
  currentExecutionId?: string;

  // Usage tracking
  usageToday: number;
  usageThisMonth: number;
  lastUsedAt?: Date;

  createdAt: Date;
}
```

---

## 11. Dependencies & Integrations

### NPM Packages (Core)

```json
{
  "dependencies": {
    // Framework
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",

    // Backend
    "convex": "^1.18.0",
    "@convex-dev/auth": "^0.0.x",

    // UI
    "@radix-ui/react-*": "^1.x",
    "tailwindcss": "^4.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.6.0",

    // Feature: Whiteboarding
    "@excalidraw/excalidraw": "^0.18.0",
    "socket.io-client": "^4.8.0",

    // Feature: Notes
    "@blocknote/core": "^0.46.0",
    "@blocknote/react": "^0.46.0",

    // AI
    "ai": "^4.0.0",  // Vercel AI SDK
    "@langchain/langgraph": "^0.2.0",

    // Payments
    "@convex-dev/stripe": "^0.x.x"
  },
  "devDependencies": {
    // TypeScript
    "typescript": "^5.7.0",

    // Testing
    "vitest": "^2.1.0",
    "@playwright/test": "^1.49.0",
    "convex-test": "^0.0.x",
    "@testing-library/react": "^16.0.0",

    // Code Quality
    "@biomejs/biome": "^1.9.0"
  }
}
```

### External Services

| Service | Purpose | Pricing |
|---------|---------|---------|
| **Convex** | Backend/Database | Free tier → $25/month |
| **Vercel** | Hosting | Free tier → $20/month |
| **Google Cloud Run** | excalidraw-room | ~$5/month |
| **Daytona** | AI Sandboxes | Usage-based |
| **Stripe** | Payments | 2.9% + $0.30 per transaction |
| **Google OAuth** | Authentication | Free |

### Open Source Projects Used

| Project | Purpose | License |
|---------|---------|---------|
| **Excalidraw** | Whiteboarding | MIT |
| **excalidraw-room** | Real-time collaboration | MIT |
| **BlockNote** | Note editing | MIT (core), GPL-3.0 (XL packages) |
| **shadcn/ui** | UI components | MIT |
| **Ralph TUI** | Loop orchestration | MIT |
| **Agent Browser** | E2E testing | MIT |

---

## 12. Competitive Analysis

### Productivity Tools

| Tool | Strengths | Weaknesses | Our Advantage |
|------|-----------|------------|---------------|
| **Notion** | All-in-one, databases, templates | Expensive at scale, slow performance | Simpler, faster, open source |
| **Linear** | Beautiful UX, developer-focused | No whiteboarding, no notes | Unified experience |
| **Miro** | Powerful whiteboarding | No notes, no todos, expensive | Integrated suite |
| **Obsidian** | Local-first, privacy | No collaboration, no whiteboard | Real-time collab |

### AI Coding Tools

| Tool | Strengths | Weaknesses | Our Advantage |
|------|-----------|------------|---------------|
| **Cursor** | Great IDE integration | No autonomous loops, context limits | Ralph Loop pattern |
| **Replit Agent** | Browser-based, simple | Limited to simple apps | Enterprise-ready loops |
| **GitHub Copilot** | Excellent autocomplete | Reactive, not proactive | Autonomous execution |
| **Devin** | Full autonomous agent | Expensive, closed, limited access | Open source, subscription-based |

### Our Unique Position

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          COMPETITIVE MOAT                                    │
└─────────────────────────────────────────────────────────────────────────────┘

1. INTERVIEW-DRIVEN PRD
   Nobody else does structured AI interviews to generate PRDs

2. SUBSCRIPTION-BASED AUTH
   Use your $200/month Claude Pro instead of $3,000/month API credits

3. INTEGRATED ECOSYSTEM
   Productivity (boards, notes, todos) + AI Development in one platform

4. OPEN SOURCE
   MIT license, no vendor lock-in, community contributions

5. RALPH LOOP PATTERN
   Proven autonomous execution, quality gates, E2E testing
```

---

## 13. Implementation Roadmap

### Phase 1: Millhouse CLI (1 Week Sprint)

| Day | Tasks |
|-----|-------|
| **Day 1-2** | Core CLI structure, Claude subprocess bridge |
| **Day 3** | Interview engine, PRD generation |
| **Day 4** | Ralph TUI integration, config generation |
| **Day 5** | Run mode, progress monitoring |
| **Day 6** | Review mode, Agent Browser integration |
| **Day 7** | Testing, documentation, polish |

### Phase 2: Collab Platform (2-3 Weeks)

| Week | Tasks |
|------|-------|
| **Week 1** | Project setup, auth, workspace system, basic dashboard |
| **Week 2** | Boards (Excalidraw), Notes (BlockNote), real-time sync |
| **Week 3** | Todos, collections, search, activity, notifications, polish |

### Phase 3: Millhouse GUI (3-4 Weeks)

| Week | Tasks |
|------|-------|
| **Week 1** | Project management, GitHub integration, configuration |
| **Week 2** | Kanban board, PRD chat interface, task lifecycle |
| **Week 3** | Daytona integration, execution monitoring, log streaming |
| **Week 4** | AI account management, testing integration, deployment, polish |

---

## 14. Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Convex Auth issues | MEDIUM | HIGH | Fallback to Better Auth |
| excalidraw-room scaling | LOW | MEDIUM | Cloud Run auto-scaling |
| Daytona reliability | MEDIUM | HIGH | Fallback to direct container deployment |
| BlockNote limitations | LOW | MEDIUM | Fork and customize if needed |

### Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Claude subscription changes | LOW | HIGH | Support multiple AI providers |
| Competition from AI giants | MEDIUM | MEDIUM | Focus on niche (SMB, open source) |
| Community adoption slow | MEDIUM | MEDIUM | Build in public, content marketing |

### Mitigation Strategies

1. **Authentication Fallback**: If Convex Auth fails, Better Auth can be integrated with existing Convex functions in 4-6 hours.

2. **AI Provider Flexibility**: Build provider abstraction layer from day one to support Claude, GPT, and others.

3. **Self-Hosted Option**: Keep all components self-hostable for users who need it.

---

## 15. My Commentary & Recommendations

### What I Think About This Project

**This is genuinely exciting and well-timed.** Here's my analysis:

#### Strengths of the Vision

1. **The Ralph Loop insight is profound.** Memory in files, not context windows, is the key unlock for autonomous development. This is a legitimate paradigm shift.

2. **The economics are compelling.** SMBs paying $10K+/year on SaaS they don't love is a real pain point. Custom software at 1-year SaaS cost is a strong value proposition.

3. **The tech stack choices are sound.** Next.js + Convex + Bun is a modern, AI-friendly stack. Real-time by default is the right choice for collaboration tools.

4. **Building on battle-tested open source (Excalidraw, BlockNote) is smart.** Don't reinvent wheels. Focus on the integration and experience.

#### Areas to Watch

1. **Scope creep risk is high.** Three phases is a lot. Recommend shipping Phase 1 CLI before building Phase 2 features.

2. **AI subscription management is complex.** The magic link authentication, account rotation, and rate limit handling needs careful implementation.

3. **Phase 3 has the most unknowns.** Daytona integration, long-running containers, and multi-account management are all complex.

#### My Recommendations

1. **Ship Phase 1 CLI in the 1-week sprint** - It's the core innovation and proves the concept.

2. **For Phase 2, start with a single feature** - Build Boards first, then Notes, then Todos. Don't try to ship everything at once.

3. **Consider Convex Auth over Better Auth initially** - Less setup, and you can migrate later if needed.

4. **Use Biome from day one** - The speed improvement is worth it, and migration from ESLint later is painful.

5. **Build the PWA last** - Web works everywhere. Mobile optimization can come after core features are stable.

### Tech Stack Validation

After extensive research, I validate your choices with these adjustments:

| Your Choice | My Validation | Notes |
|-------------|---------------|-------|
| Next.js | **Strongly Agree** | AI familiarity is the deciding factor |
| Convex | **Strongly Agree** | Real-time by default is perfect for this |
| Better Auth | **Conditional** | Start with Convex Auth, migrate if needed |
| Capacitor | **Agree** | But build PWA fallback first |
| Biome | **Strongly Agree** | 20x speed improvement is worth it |
| Vitest + Playwright | **Strongly Agree** | Industry standard for this stack |
| Fumadocs | **Agree** | Clean, Next.js native |
| LangGraph | **Agree** | For complex AI workflows in Phase 3 |

---

## 16. Naming Suggestions

### Current Names

- **Collab** - The productivity platform (boards, notes, todos)
- **Millhouse** - The AI coding CLI/GUI

### Alternative Suggestions

#### For the Unified Platform

| Name | Rationale |
|------|-----------|
| **Forge** | Software forge - where things are created |
| **Foundry** | Factory for building software |
| **Anvil** | Tool for shaping (software) |
| **Loom** | Weaving together productivity + development |
| **Canvas** | Blank slate for creation (boards, code) |

#### For the CLI Specifically

| Name | Rationale |
|------|-----------|
| **Ralph** | Direct reference to the loop pattern |
| **Loop** | Simple, descriptive |
| **Spin** | Spinning up agents |
| **Arc** | Development arc from idea to code |

### My Opinion

**Keep "Millhouse"** - it's memorable, has the Simpsons connection to Ralph, and "Everything's coming up Millhouse!" is a great tagline.

**Consider renaming "Collab"** - it's generic. Something like **"Forge"** or **"Canvas"** better captures the creative/building aspect.

Alternatively, make it all one brand: **"Millhouse"** with sub-products:
- Millhouse CLI
- Millhouse Boards
- Millhouse Notes
- Millhouse Studio (the GUI)

---

## 17. Research Sources

### Technology Documentation

- [Convex Official Documentation](https://docs.convex.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://better-auth.com/)
- [Excalidraw Developer Docs](https://docs.excalidraw.com/)
- [BlockNote Documentation](https://www.blocknotejs.org/docs)
- [Daytona Documentation](https://daytonadocs.com/)
- [Fumadocs Documentation](https://www.fumadocs.dev/)
- [Biome Documentation](https://biomejs.dev/)

### Comparisons & Analysis

- [Convex vs Supabase: The Definitive Comparison (2026)](https://scratchdb.com/compare/convex-vs-supabase/)
- [Better Auth vs Clerk: Complete Authentication Comparison](https://clerk.com/articles/better-auth-clerk-complete-authentication-comparison-react-nextjs)
- [Biome vs ESLint: The Ultimate 2025 Showdown](https://medium.com/@harryespant/biome-vs-eslint-the-ultimate-2025-showdown-for-javascript-developers-speed-features-and-3e5130be4a3c)
- [AI Sandboxes: Daytona vs microsandbox](https://pixeljets.com/blog/ai-sandboxes-daytona-vs-microsandbox/)
- [Top TypeScript AI Agent Frameworks 2026](https://blog.agentailor.com/posts/top-typescript-ai-agent-frameworks-2026)

### Ralph Loop & AI Development

- [GitHub - snarktank/ralph: Autonomous AI agent loop](https://github.com/snarktank/ralph)
- [2026 - The Year of the Ralph Loop Agent](https://dev.to/alexandergekov/2026-the-year-of-the-ralph-loop-agent-1gkj)
- [State of AI Agents - LangChain](https://www.langchain.com/state-of-agent-engineering)

### Market Research

- [The 2025 Software Spend Report - Cledara](https://www.cledara.com/blog/2025-software-spend-report)
- [How Much Does Custom Software Development Cost in 2026](https://iqonic.tech/blog/custom-software-development-cost-breakdown/)

---

## Appendix A: Convex Schema (Phase 2)

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // Workspaces
  workspaces: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerId: v.id("users"),
    settings: v.object({
      allowMemberInvites: v.boolean(),
    }),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_owner", ["ownerId"]),

  // Workspace Members
  workspaceMembers: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
    joinedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_user", ["userId"]),

  // Invitations
  invitations: defineTable({
    workspaceId: v.id("workspaces"),
    email: v.optional(v.string()),
    token: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
    expiresAt: v.number(),
    usedAt: v.optional(v.number()),
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_email", ["email"]),

  // Collections
  collections: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    parentId: v.optional(v.id("collections")),
    ownerId: v.id("users"),
    visibility: v.union(v.literal("private"), v.literal("workspace")),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_parent", ["parentId"]),

  // Boards (Excalidraw)
  boards: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    ownerId: v.id("users"),

    // Storage
    dataFileId: v.optional(v.id("_storage")),
    thumbnailFileId: v.optional(v.id("_storage")),

    // Collaboration
    roomId: v.string(),

    // Visibility
    visibility: v.union(
      v.literal("private"),
      v.literal("workspace"),
      v.literal("public")
    ),
    shareToken: v.optional(v.string()),

    // Organization
    collectionId: v.optional(v.id("collections")),
    isFavorite: v.boolean(),

    // Metadata
    elementCount: v.number(),
    lastEditedBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_collection", ["collectionId"])
    .index("by_room", ["roomId"])
    .index("by_share_token", ["shareToken"]),

  // Notes (BlockNote)
  notes: defineTable({
    workspaceId: v.id("workspaces"),
    title: v.string(),
    ownerId: v.id("users"),

    // Content
    content: v.string(),

    // Visibility
    visibility: v.union(
      v.literal("private"),
      v.literal("workspace"),
      v.literal("public")
    ),
    shareToken: v.optional(v.string()),

    // Organization
    collectionId: v.optional(v.id("collections")),
    isFavorite: v.boolean(),

    // Metadata
    wordCount: v.number(),
    lastEditedBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_collection", ["collectionId"])
    .index("by_share_token", ["shareToken"]),

  // Todos (Personal)
  todos: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),

    content: v.string(),
    details: v.optional(v.string()),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_workspace", ["userId", "workspaceId"]),

  // Activity Logs
  activityLogs: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    action: v.string(),
    resourceType: v.string(),
    resourceId: v.string(),
    resourceName: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_time", ["workspaceId", "createdAt"]),

  // Comments
  comments: defineTable({
    resourceType: v.union(v.literal("board"), v.literal("note")),
    resourceId: v.string(),
    userId: v.id("users"),
    content: v.string(),
    position: v.optional(v.object({
      x: v.number(),
      y: v.number(),
    })),
    parentId: v.optional(v.id("comments")),
    resolved: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_resource", ["resourceType", "resourceId"])
    .index("by_parent", ["parentId"]),
});
```

---

## Appendix B: File Structure

```
collab/
├── apps/
│   ├── web/                      # Next.js application
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── sign-in/
│   │   │   │   ├── sign-up/
│   │   │   │   └── invite/[token]/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx          # Dashboard
│   │   │   │   ├── boards/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── notes/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── collections/
│   │   │   │   └── settings/
│   │   │   ├── (public)/
│   │   │   │   └── view/[token]/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx              # Landing
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui
│   │   │   ├── boards/
│   │   │   │   ├── excalidraw-wrapper.tsx
│   │   │   │   └── board-card.tsx
│   │   │   ├── notes/
│   │   │   │   ├── blocknote-wrapper.tsx
│   │   │   │   └── note-card.tsx
│   │   │   ├── todos/
│   │   │   ├── dashboard/
│   │   │   └── shared/
│   │   ├── lib/
│   │   │   ├── convex.ts
│   │   │   ├── encryption.ts
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   │   ├── use-socket.ts
│   │   │   └── use-debounce.ts
│   │   └── styles/
│   │
│   └── docs/                     # Fumadocs documentation
│
├── packages/
│   ├── convex/                   # Convex backend
│   │   ├── _generated/
│   │   ├── schema.ts
│   │   ├── auth.ts
│   │   ├── http.ts
│   │   ├── users.ts
│   │   ├── workspaces.ts
│   │   ├── boards.ts
│   │   ├── notes.ts
│   │   ├── todos.ts
│   │   ├── collections.ts
│   │   ├── comments.ts
│   │   └── activityLogs.ts
│   │
│   └── shared/                   # Shared utilities
│       ├── types/
│       └── utils/
│
├── millhouse/                    # CLI (Phase 1)
│   ├── src/
│   │   ├── cli/
│   │   ├── core/
│   │   ├── infrastructure/
│   │   └── utils/
│   ├── package.json
│   └── README.md
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .github/
├── biome.json
├── package.json
├── turbo.json                    # Monorepo management
└── README.md
```

---

*Document Version: 1.0.0 | January 18, 2026 | Co-authored by Ansar & Claude*

*"Everything's coming up Millhouse!"*
