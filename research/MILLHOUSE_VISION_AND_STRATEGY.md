# MillHouse: Vision, Strategy & Technology Roadmap

> **Document Version**: 1.0.0
> **Date**: January 18, 2026
> **Authors**: Ansar & Claude (Co-Authors)
> **Purpose**: Comprehensive capture of strategic discussions, technology decisions, and future vision

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [MillHouse Phase 1: The CLI Foundation](#2-millhouse-phase-1-the-cli-foundation)
3. [The Ralph Loop: The Inflection Point](#3-the-ralph-loop-the-inflection-point)
4. [Technology Stack Decisions](#4-technology-stack-decisions)
5. [MillHouse Phase 2: The Platform Vision](#5-millhouse-phase-2-the-platform-vision)
6. [The Future of Software: Ansar's Thesis](#6-the-future-of-software-ansars-thesis)
7. [The Three Approaches to Building Software](#7-the-three-approaches-to-building-software)
8. [The Hybrid Approach: Knowledge Extraction](#8-the-hybrid-approach-knowledge-extraction)
9. [Business Model & Go-to-Market](#9-business-model--go-to-market)
10. [Technology Architecture](#10-technology-architecture)
11. [Roadmap & Timeline](#11-roadmap--timeline)
12. [Key Insights & Decisions](#12-key-insights--decisions)

---

## 1. Executive Summary

### What is MillHouse?

MillHouse is an **opinionated CLI/TUI** that abstracts three powerful tools into a seamless autonomous software development experience:

1. **Claude Code CLI** (via subprocess) - The AI brain
2. **Ralph TUI** - The autonomous loop orchestrator
3. **Agent Browser CLI** - The E2E testing engine

**Core Philosophy**: "Everything's coming up Milhouse!" - Making autonomous AI development accessible to everyone by hiding complexity while delivering power.

### The Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MILLHOUSE EVOLUTION                                 │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: MillHouse CLI (Current Focus)
═══════════════════════════════════════
• Local tool running on developer's machine
• Uses YOUR Claude Pro/Max subscription
• Abstracts Ralph TUI completely
• Interview-driven PRD generation
• Autonomous code execution via Ralph Loop

PHASE 2: MillHouse Platform (Future Vision)
═══════════════════════════════════════════
• Web application with GUI
• Multi-user, multi-organization support
• Daytona sandbox containers
• Real-time execution monitoring
• Kanban-style project management
• No terminal required - fully browser-based

PHASE 3: Software Factory (Ultimate Vision)
═══════════════════════════════════════════
• Build custom software for SMBs
• Replace SaaS subscriptions with owned software
• Knowledge extraction from open source
• Boutique SaaS model
• Recurring revenue through managed hosting
```

### Key Innovation

MillHouse isn't just a wrapper - it's a **complete abstraction layer** that makes autonomous AI development accessible to everyone. The core innovations:

1. **Interview-Driven PRD Generation** - No one else does this
2. **Zero-Configuration Ralph TUI** - Users never see Ralph's complexity
3. **Loop-Inside-Loop Review Mode** - Detects AND fixes issues automatically
4. **Agent Browser E2E Integration** - Real browser testing in the loop

---

## 2. MillHouse Phase 1: The CLI Foundation

### Authentication Model

**Critical Decision**: MillHouse uses Claude Code CLI via subprocess (same as Ralph TUI), NOT the Agent SDK.

| Method | Subscription Auth | API Key Auth |
|--------|-------------------|--------------|
| Claude Agent SDK | NO | YES |
| Claude Code CLI (subprocess) | YES | YES |

**This means users can use their Claude Pro/Max subscription - no API key required!**

### Core Modes

#### Plan Mode
```
User runs: milhouse plan
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 1: THE SCREAM PHASE                                        │
│  User enters free-form description of what they want to build    │
└──────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│  CLAUDE CLI: Research & Analysis                                 │
│  • Analyzes codebase                                             │
│  • Identifies relevant files                                     │
│  • Understands project structure                                 │
└──────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 2: RESOURCES PHASE                                         │
│  User confirms/adds files, docs, URLs Claude should reference    │
└──────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 3: INTERVIEW PHASE                                         │
│  Claude asks contextual questions to refine requirements         │
│  Intensity levels: Chill (5-7) | Thorough (10-15) | Comprehensive│
└──────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│  PRD GENERATION                                                  │
│  Claude generates structured PRD with user stories               │
└──────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│  AUTO-CONFIGURATION                                              │
│  • Convert PRD to JSON tracker                                   │
│  • Generate Ralph TUI config                                     │
│  • Create git worktree                                           │
│  • Session ready to run                                          │
└──────────────────────────────────────────────────────────────────┘
```

#### Run Mode
- Executes sessions through Ralph TUI
- Real-time progress monitoring
- Detach/attach capability
- Quality gates after each story

#### Review Mode
- Nested execution (loop within loop)
- Analyze → Fix → Test → Document
- Agent Browser for E2E testing
- Presets: minimum, standard, thorough, complete

### Key Design Decisions

1. **Subprocess over SDK** - Spawn `claude` CLI to support subscription auth
2. **JSONL for progress** - Parse Claude's streaming output for UI updates
3. **RALF fully automated** - Users never configure Ralph directly
4. **Git worktrees** - Isolated branches for each session

---

## 3. The Ralph Loop: The Inflection Point

### What is the Ralph Loop?

Named after Ralph Wiggum from The Simpsons, the Ralph Loop is a deceptively simple but revolutionary concept:

```javascript
while (true) {
    spawn_fresh_ai_agent()
    give_it_the_PRD()
    let_it_work()
    if (all_tasks_complete) break
}
```

### The Genius Insight

**Memory doesn't live in the AI's context window. Memory lives in:**
- Files on disk
- Git history
- Progress trackers
- Task status files

When the context fills up → spawn fresh agent → it reads the files → continues where the last one left off.

### Why This is THE Inflection Point

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   Before Ralph Loop:              After Ralph Loop:                         │
│   ──────────────────              ──────────────────                        │
│   AI = Assistant                  AI = Worker                               │
│   AI helps you code               AI codes FOR you                          │
│   Limited by context              Limited only by time                      │
│   Needs constant guidance         Needs only a good PRD                     │
│   "AI-assisted development"       "AI-driven development"                   │
│                                                                              │
│                    ┌─────────────────────────────────┐                      │
│                    │                                 │                      │
│                    │   The moment software becomes   │                      │
│                    │   a COMMODITY that AI produces  │                      │
│                    │                                 │                      │
│                    │   Not a SERVICE you rent        │                      │
│                    │   Not a CRAFT requiring humans  │                      │
│                    │                                 │                      │
│                    │   A PRODUCT AI manufactures     │                      │
│                    │                                 │                      │
│                    └─────────────────────────────────┘                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### MillHouse = Ralph Loop + PRD Generation + Quality Gates + E2E Testing

MillHouse is essentially a **SOFTWARE FACTORY**:
- **Input**: Requirements (from interview)
- **Output**: Working, tested software

The factory runs 24/7. It doesn't get tired. It doesn't take vacations.

---

## 4. Technology Stack Decisions

### The Convex Decision

#### What is Convex?

Convex is a **reactive backend platform** that keeps applications automatically synchronized between frontend, backend, and database. Unlike traditional approaches where you manually wire up real-time features, Convex makes real-time sync the default.

#### Convex vs Supabase: The Core Difference

**Supabase Philosophy**: "Here are powerful tools (PostgreSQL, real-time subscriptions, auth). Wire them together yourself."

**Convex Philosophy**: "Real-time sync is the default. Query data, UI updates automatically. Done."

#### Detailed Comparison

| Aspect | Supabase | Convex |
|--------|----------|--------|
| **Database** | PostgreSQL (SQL) | Document store (TypeScript) |
| **Real-time** | Add-on (manual setup) | Built-in (automatic) |
| **Type safety** | Manual effort | Automatic end-to-end |
| **Philosophy** | Traditional + enhancements | Reactive by default |
| **Learning curve** | Familiar if you know SQL | New patterns |
| **Community** | Huge (96k GitHub stars) | Growing (9k stars) |
| **Open source** | Fully | Recently open-sourced |

#### Why Convex for MillHouse Platform?

The platform needs:
1. **Live Execution Logs** - Sandbox streams → Convex → All browsers auto-update
2. **Kanban Board Updates** - Task status changes → Cards move automatically
3. **Multi-User Collaboration** - Multiple users see same real-time state
4. **TypeScript Everywhere** - End-to-end type safety

With Supabase: You'd write WebSocket code, manage subscriptions, handle reconnection.
With Convex: Just query the data. UI updates automatically.

**Verdict**: Convex is ideal for real-time collaborative applications like MillHouse Platform.

### The Next.js Decision (Over TanStack Start)

#### TanStack Start: What It Offers

TanStack Start is a new full-stack React framework built on:
- **Vite** (blazing fast dev server)
- **Nitro** (deploy anywhere)
- **TanStack Router** (industry-leading type-safe routing)

It offers:
- Superior type-safe routing (compile-time route validation)
- Less "magic" (more transparent)
- First-class Convex partnership (vetted partner)
- Deploy anywhere (not tied to Vercel)

#### Why Next.js Won

**The Decisive Factor: AI Fluency**

Ansar's requirement: "I want AI models to know how to work with this platform where I just say I want this done, and it is done."

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AI TRAINING DATA REALITY                                 │
└─────────────────────────────────────────────────────────────────────────────┘

NEXT.JS:
• 10+ years of Stack Overflow answers
• Millions of GitHub repos
• Thousands of tutorials
• Every AI model has seen Next.js code EXTENSIVELY
• When you say "create a dashboard", AI knows EXACTLY what to do

TANSTACK START:
• Release Candidate since late 2025
• Limited production codebases
• Fewer tutorials and examples
• AI models have LESS training data
• May struggle with newer patterns and edge cases
```

#### The Fit for Ansar

Ansar said:
- "I don't care if I don't understand what's happening under the hood"
- "I don't need complete customization"
- "I don't mind Vercel lock-in"
- "I want AI to do the heavy lifting"

**TanStack Start's advantages (control, transparency, type-safe routing) are not what Ansar needs.**
**Next.js's advantages (AI familiarity, ecosystem, Vercel optimization) ARE what Ansar needs.**

### Final Recommended Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              MILLHOUSE PLATFORM: RECOMMENDED STACK                          │
└─────────────────────────────────────────────────────────────────────────────┘

FRONTEND
────────
• Next.js 14+ (App Router)         ─── Battle-tested, AI knows it cold
• React 18+                        ─── Standard
• TypeScript                       ─── Type safety
• Tailwind CSS + shadcn/ui         ─── Styling (AI-friendly)

BACKEND / DATABASE
──────────────────
• Convex                           ─── Real-time, type-safe, "just works"

DEPLOYMENT
──────────
• Vercel                           ─── Optimized for Next.js

SANDBOX ORCHESTRATION
─────────────────────
• Daytona                          ─── Container management for isolated builds
```

---

## 5. MillHouse Phase 2: The Platform Vision

### From CLI to GUI

The vision: Evolve MillHouse from a local CLI tool to a full web platform where users never touch a terminal.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        WEB APPLICATION                                       │
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │  Your Browser (GUI)                                                  │  │
│   │                                                                      │  │
│   │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐      │  │
│   │  │ Idea Board │  │  Planning  │  │   Kanban   │  │ Real-time │      │  │
│   │  │  (Clone X) │  │    Chat    │  │   Board    │  │    Logs   │      │  │
│   │  └────────────┘  └────────────┘  └────────────┘  └───────────┘      │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                     │                                        │
│                                     │ Real-time sync (Convex)               │
│                                     ▼                                        │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                         CONVEX BACKEND                               │  │
│   │                                                                      │  │
│   │  • Organizations & Users     • Real-time task updates                │  │
│   │  • Repository connections    • Live execution logs                   │  │
│   │  • PRDs, Stories, Boards     • Collaboration features                │  │
│   │  • Session state             • AI conversation history               │  │
│   └─────────────────────────────────┬────────────────────────────────────┘  │
│                                     │                                        │
└─────────────────────────────────────┼────────────────────────────────────────┘
                                      │
                                      │ API calls
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DAYTONA SANDBOX CONTAINERS                            │
│                                                                              │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│   │    Sandbox 1     │  │    Sandbox 2     │  │    Sandbox N     │         │
│   │                  │  │                  │  │                  │         │
│   │  • MillHouse CLI │  │  • MillHouse CLI │  │  • MillHouse CLI │         │
│   │  • Claude Code   │  │  • Claude Code   │  │  • Claude Code   │         │
│   │  • Ralph TUI     │  │  • Ralph TUI     │  │  • Ralph TUI     │         │
│   │  • Git clone     │  │  • Git clone     │  │  • Git clone     │         │
│   └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Platform Features

1. **Organization Management**
   - Multi-tenant support
   - Team collaboration
   - Role-based access

2. **Repository Integration**
   - Connect GitHub/GitLab repos
   - Branch management
   - PR creation

3. **Planning Interface**
   - Chat with AI to explore ideas
   - Idea board for inspiration
   - SCRUM-style requirements gathering

4. **Kanban Board**
   - Visual task management
   - Real-time status updates
   - Cards move as AI completes work

5. **Execution Monitoring**
   - Live log streaming
   - Progress visualization
   - Multi-sandbox management

6. **Deployment Integration**
   - Vercel, VPS, or custom
   - One-click launch

### The User Experience

**Without touching a terminal:**
1. Log into MillHouse Platform
2. Connect your repository
3. Describe what you want to build
4. Answer interview questions
5. Approve the PRD
6. Watch AI build in real-time
7. Review and deploy

---

## 6. The Future of Software: Ansar's Thesis

### The Core Thesis

> "In the future, people will start paying for OWNED software instead of RENTED software (SaaS). The economics have shifted. Building things will not be expensive anymore."

### The Problem with Current SaaS Model

A typical small business needs:
- Workspace management tool
- Communications tool (internal + client)
- Customer relationship management (CRM)
- Operations management
- HR & productivity tools
- Finances & payroll
- Marketing management
- Project & task tracking
- Scheduling & billing

**Result**:
- 5-10+ subscriptions
- $5,000-$15,000/month
- Tools that don't integrate well
- "Working for the software instead of software working for them"

### The Economics Have Flipped

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE MATH HAS CHANGED                                     │
└─────────────────────────────────────────────────────────────────────────────┘

                        BEFORE AI                    AFTER AI (Now)
                        ══════════                   ══════════════
Custom CRM cost:        $100,000 - $300,000         $10,000 - $50,000
Development time:       6-12 months                  1-3 months
Ongoing maintenance:    $50,000/year (devs)         $5,000/year (AI agents)
Break-even vs SaaS:     5-10 years                  6-18 months
```

**Example:**
- SMB spends $10,000/year on software subscriptions
- In 5 years = $50,000 GONE with nothing to show for it
- If you build them custom software for $30,000:
  - They OWN it forever
  - Year 2 onwards = pure savings
  - It's CUSTOMIZED to their exact workflow

### SMB Software Spending Reality (Market Research)

- SMBs spend average **$10,000/year** on software
- Startups spend **$8,000 per employee** on software
- Global SMB software market: **$72.35 billion** in 2025
- **90%** of investments are subscription-based
- SMBs with 10 employees: **$20,000-$30,000/year** on IT

### The Shift: SaaS → Owned Software

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   CURRENT MODEL (SaaS)              FUTURE MODEL (Owned)                    │
│   ════════════════════              ════════════════════                    │
│                                                                              │
│   • Pay monthly forever             • Pay once, own forever                 │
│   • Features you don't need         • Only what you need                    │
│   • Generic workflows               • Your exact workflow                   │
│   • Integrations that barely work   • Native integrations                   │
│   • Data on their servers           • Your data, your servers               │
│   • Price increases over time       • Fixed cost                            │
│   • Vendor lock-in                  • Full control                          │
│   • "Good enough"                   • Perfect fit                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Timeline Assessment

**Is this thesis ahead of its time?**

**No. The inflection point is NOW.**

Evidence:
- Ralph Loop emerged December 2025
- Claude Code, Cursor, Windsurf maturing rapidly
- AI coding costs dropping exponentially
- SMBs spending $10K+/year on software they don't love

**Timeline:**
- 2025: Ralph Loop emerges, early adopters experiment
- 2026 (NOW): First wave of AI-built custom software
- 2027-2028: Mainstream awareness ("I can own my software?")
- 2029+: SaaS companies feel pressure, custom becomes default

**Verdict: 2-3 year FIRST MOVER ADVANTAGE, not "ahead of time"**

---

## 7. The Three Approaches to Building Software

### Approach 1: Build from Scratch

**How it works:**
- Client says: "I need a CRM with invoicing"
- Interview them (MillHouse Plan Mode)
- AI generates PRD
- Build from scratch using your stack
- Deliver completely custom software

**Pros:**
- 100% customized
- No licensing issues
- Modern, clean architecture
- AI knows the stack perfectly
- Can be templated and reused
- Full control

**Cons:**
- Every project starts from zero
- Reinventing solved problems
- More AI compute time
- Complex domains need expertise
- Testing burden is on you
- Edge cases you haven't found

**Best for:** Unique business processes, simple to medium complexity tools, dashboards, internal tools

### Approach 2: Use Open Source as Foundation

**How it works:**
- Client says: "I need a CRM with invoicing"
- Select best open-source base (ERPNext, Odoo, Twenty)
- Deploy it for them
- Customize modules to fit their needs
- Deliver proven software with customizations

**Pros:**
- Battle-tested code
- Complex domains already solved
- Community support
- Security vulnerabilities patched
- Edge cases already handled
- Faster deployment

**Cons:**
- Tech stack is NOT your choice
- AI may struggle with unfamiliar frameworks
- Customization can be painful
- Licensing complexity
- Upgrade path breaks customizations
- "Frankenstack" feeling

**Best for:** Complex domains (accounting, ERP), industry-standard compliance, speed to market priority

### Approach 3: Hybrid (Knowledge Extraction) ← RECOMMENDED

**The Innovative Idea:**

> "What if I could SCRAPE the knowledge from 5 open-source solutions, extract all the patterns, data models, and business logic, then have AI build a FRESH implementation in my modern stack, using that extracted knowledge as context?"

**How it works:**
- Analyze multiple open-source solutions (Twenty, SuiteCRM, ERPNext, etc.)
- AI extracts: data models, business rules, edge cases, UI patterns
- Store as "Knowledge Bases" (markdown documentation)
- When building for client, inject relevant Knowledge Base as context
- AI builds fresh in your stack, informed by decades of domain expertise

**Pros:**
- Best of both worlds
- No licensing issues (extracting knowledge, not code)
- AI knows your stack perfectly
- Clean, cohesive architecture
- Decades of expertise distilled
- Truly differentiated offering
- Becomes your "secret sauce"

**Cons:**
- Requires upfront work to build extraction pipeline
- Extraction isn't perfect
- Need domain expertise to validate
- More complex setup initially

**Best for:** Building a PLATFORM for creating business software, serving many clients in similar domains, long-term competitive advantage

---

## 8. The Hybrid Approach: Knowledge Extraction

### The System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE MILLHOUSE KNOWLEDGE SYSTEM                           │
└─────────────────────────────────────────────────────────────────────────────┘

                         PHASE 1: KNOWLEDGE EXTRACTION

    OPEN SOURCE REPOS                    KNOWLEDGE BASES

    ┌──────────┐                        ┌────────────────────────────────┐
    │  Odoo    │                        │  📁 CRM Knowledge Base         │
    │ ERPNext  │  ──── AI Extracts ───► │                                │
    │  Twenty  │       & Synthesizes    │  • data-models.md              │
    │ SuiteCRM │                        │  • business-rules.md           │
    │ Dolibarr │                        │  • workflows.md                │
    └──────────┘                        │  • validations.md              │
                                        │  • edge-cases.md               │
                                        │  • ui-patterns.md              │
                                        └────────────────────────────────┘


                         PHASE 2: PROJECT EXECUTION

    CLIENT REQUEST                       MILLHOUSE PLATFORM

    "I need a CRM with                  1. Interview client
     invoicing and basic                2. Generate PRD
     project tracking"                  3. SELECT relevant KBs:
           │                               • CRM Knowledge Base
           ▼                               • Invoicing Knowledge Base
    ┌───────────────┐                   4. Inject KB context into PRD
    │   MillHouse   │ ────────────────► 5. Run Ralph Loop
    │    Plan Mode  │                   6. Build in Next.js + Convex
    └───────────────┘                   7. Deliver custom software

    The AI doesn't need to "figure out" how CRMs work.
    It already KNOWS from the Knowledge Base.
```

### What Gets Extracted

#### 1. Data Models
```markdown
# Contact Data Model (from Twenty)

## Core Fields
- firstName: string (required)
- lastName: string (required)
- email: string (unique, validated format)
- phone: string (international format support)
- company: relation to Company (many-to-one)

## Relationships
- Contact has many Activities
- Contact has many Notes
- Contact belongs to many Opportunities
```

#### 2. Business Rules
```markdown
# CRM Business Rules

## Email Validation
- Format validation: RFC 5322 compliant
- Duplicate handling: warn but allow
- Case sensitivity: stored lowercase

## Deal Stage Transitions
- Stages are ordered (can't skip)
- Backward movement allowed
- Stage change triggers activity logging
```

#### 3. Edge Cases
```markdown
# Known Edge Cases (from GitHub Issues)

## Contact Merging
- Activities go to primary contact
- Custom field conflicts: keep both, flag for review

## GDPR Compliance
- "Forget me": anonymize, don't delete
- Data export: all PII in JSON format
```

#### 4. UI/UX Patterns
```markdown
# UI Patterns

## Contact List View
- Table with sortable columns
- Quick actions on hover
- Bulk selection with shift+click

## Pipeline View
- Kanban with drag-drop
- Color coding by deal health
```

### The Extraction Pipeline

```bash
milhouse extract --repo ./twenty --domain crm --output ./knowledge-bases/crm/
```

The AI examines:
- Database schemas
- Business logic code
- Tests (reveal edge cases!)
- GitHub issues (real-world problems)
- Documentation

---

## 9. Business Model & Go-to-Market

### The Value Proposition

**To SMB Clients:**

> "You're paying $X per month for tools you don't love. Pay me that amount for one year, and in 5 months I'll deliver custom software you OWN forever. After year one, you keep the savings."

### Revenue Streams

#### 1. Custom Development (One-Time)
```
Traditional Quote: $100,000
Your Quote:        $30,000 (1 year of their SaaS spend)

Why you can charge less:
• AI does the heavy lifting
• Knowledge bases accelerate development
• Ralph Loop runs 24/7
```

#### 2. Managed Hosting (Recurring)
```
Client used to pay:  $5,000/month for various SaaS
Now they pay you:    $500/month for hosting + management

What you provide:
• Cloud hosting
• Updates and maintenance
• AI-powered support
• Minor customizations

100 clients × $500/month = $50,000/month recurring
```

#### 3. Boutique SaaS (Scale)
```
After 10+ implementations in same vertical:
• Refined product emerges
• "MillHouse CRM for Agencies"
• One-time purchase: $15,000
• Managed hosting: $500/month
• Customization packages: $5,000+

NOT mass-market SaaS. High-touch, premium service.
```

### Target Market

**Ideal Client Profile:**
- Small business (10-50 employees)
- Spending $5,000-$15,000/month on software
- Frustrated with generic tools
- Values customization over "industry standard"
- Has specific workflows that don't fit existing solutions

**Verticals to Target:**
- Creative agencies
- Professional services firms
- E-commerce operations
- Healthcare practices
- Real estate agencies
- Property management
- Construction companies

### Competitive Advantage (The Moat)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         YOUR MOAT                                           │
└─────────────────────────────────────────────────────────────────────────────┘

Anyone can use Claude Code.

Only YOU have:
• Extracted decades of CRM/ERP wisdom into structured knowledge bases
• Built the MillHouse orchestration platform
• Proven the model with real clients
• Accumulated domain expertise

The knowledge bases are your competitive advantage.
They improve with every project.
They're defensible. They're valuable.
```

---

## 10. Technology Architecture

### Full Platform Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MILLHOUSE PLATFORM ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────┘

                             USER'S BROWSER
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
    ┌───────────┐           ┌───────────┐           ┌───────────┐
    │  Next.js  │           │  Next.js  │           │  Next.js  │
    │ /dashboard│           │ /project  │           │ /planning │
    └─────┬─────┘           └─────┬─────┘           └─────┬─────┘
          │                       │                       │
          └───────────────────────┼───────────────────────┘
                                  │
                                  │  Convex React hooks
                                  ▼
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║                              CONVEX                                      ║
    ║                                                                          ║
    ║  DATA: Organizations, Users, Repositories, Projects, Stories,            ║
    ║        Executions, Logs, KnowledgeBases                                  ║
    ║                                                                          ║
    ║  FUNCTIONS: Queries (auto-sync), Mutations, Actions (HTTP)               ║
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
    └────────────────────────────────┬────────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
   ┌───────────────┐          ┌───────────────┐          ┌───────────────┐
   │   SANDBOX 1   │          │   SANDBOX 2   │          │   SANDBOX N   │
   │               │          │               │          │               │
   │ • MillHouse   │          │ • MillHouse   │          │ • MillHouse   │
   │ • Claude Code │          │ • Claude Code │          │ • Claude Code │
   │ • Ralph TUI   │          │ • Ralph TUI   │          │ • Ralph TUI   │
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

## 11. Roadmap & Timeline

### Phase 1: MillHouse CLI (Current - Q1 2026)
- [ ] Complete core CLI functionality
- [ ] Plan Mode with interview system
- [ ] Run Mode with Ralph TUI integration
- [ ] Review Mode with Agent Browser
- [ ] Testing and documentation
- [ ] First external users

### Phase 2: Knowledge Extraction System (Q2 2026)
- [ ] Build extraction pipeline
- [ ] Extract CRM knowledge base (Twenty, SuiteCRM, ERPNext)
- [ ] Extract Invoicing knowledge base
- [ ] Extract Project Management knowledge base
- [ ] Test: Can MillHouse build using knowledge bases?

### Phase 3: First Paying Clients (Q2-Q3 2026)
- [ ] Find 3-5 SMBs frustrated with current CRM
- [ ] Offer proposition: "Pay 1 year of HubSpot, own it forever"
- [ ] Build their custom systems
- [ ] Iterate and improve

### Phase 4: Platform Development (Q3-Q4 2026)
- [ ] Build web platform (Next.js + Convex)
- [ ] Daytona sandbox integration
- [ ] Real-time execution monitoring
- [ ] Multi-user support
- [ ] Public beta launch

### Phase 5: Scale (2027)
- [ ] Expand knowledge bases to more verticals
- [ ] Boutique SaaS offerings
- [ ] Managed hosting service
- [ ] Team expansion

---

## 12. Key Insights & Decisions

### Technology Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend Framework | Next.js | AI knows it cold, mature ecosystem |
| Backend/Database | Convex | Real-time native, TypeScript everywhere |
| Deployment | Vercel | Optimized for Next.js |
| Styling | Tailwind + shadcn/ui | AI-friendly, productive |
| Sandboxes | Daytona | Container isolation |
| AI Orchestration | Ralph TUI via MillHouse | Proven loop pattern |

### Strategic Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Build Approach | Hybrid (Knowledge Extraction) | Best of both worlds |
| Target Market | SMBs paying $5-15K/month on SaaS | Clear pain point |
| Business Model | One-time build + managed hosting | Recurring revenue |
| Differentiation | Knowledge bases | Defensible, compounds |

### Key Quotes to Remember

> "I don't care if I don't understand what's happening under the hood. I want AI to do the heavy lifting." - Ansar

> "The future is OWNED software, not RENTED software." - Ansar's Thesis

> "Memory doesn't live in the AI's context window. It lives in files, git history, and progress trackers." - Ralph Loop Insight

> "You have a 2-3 year head start. That's not ahead of time. That's FIRST MOVER ADVANTAGE." - Market Assessment

---

## Appendix: Open Source Solutions to Extract Knowledge From

### CRM Systems
- **Twenty** - Modern, open-source CRM (TypeScript/React)
- **SuiteCRM** - Full-featured CRM (PHP)
- **ERPNext CRM Module** - Part of larger ERP (Python/Frappe)
- **EspoCRM** - Lightweight CRM (PHP)
- **Krayin** - Laravel-based CRM

### ERP Systems
- **Odoo** - Comprehensive ERP (Python)
- **ERPNext** - All-in-one platform (Python/Frappe)
- **Dolibarr** - SMB-focused ERP/CRM (PHP)
- **Metasfresh** - Enterprise ERP (Java)
- **Axelor** - Modular ERP (Java)

### Invoicing
- **Invoice Ninja** - Invoicing platform
- **Crater** - Laravel invoicing
- **SolidInvoice** - Invoice management

### Project Management
- **Plane** - Open-source Jira alternative
- **Focalboard** - Trello/Notion alternative
- **Taiga** - Agile project management
- **OpenProject** - Enterprise PM

---

## Research Sources

- [GitHub - snarktank/ralph: Autonomous AI agent loop](https://github.com/snarktank/ralph)
- [2026 - The Year of the Ralph Loop Agent - DEV Community](https://dev.to/alexandergekov/2026-the-year-of-the-ralph-loop-agent-1gkj)
- [What is Ralph Loop? A New Era of Autonomous Coding - Medium](https://medium.com/@tentenco/what-is-ralph-loop-a-new-era-of-autonomous-coding-96a4bb3e2ac8)
- [Twenty - The #1 Open-Source CRM](https://twenty.com/)
- [Top 10 Most-Starred Open-Source ERP and CRM - NocoBase](https://www.nocobase.com/en/blog/top-10-most-starred-open-source-erp-and-crm-on-github)
- [The 2025 Software Spend Report - Cledara](https://www.cledara.com/blog/2025-software-spend-report)
- [How Much Does Custom Software Development Cost in 2026](https://iqonic.tech/blog/custom-software-development-cost-breakdown/)
- [TanStack Start vs Next.js Comparison - TanStack Docs](https://tanstack.com/start/latest/docs/framework/react/comparison)
- [TanStack Start Quickstart - Convex Developer Hub](https://docs.convex.dev/quickstart/tanstack-start)
- [Convex Official Website](https://www.convex.dev/)

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | January 18, 2026 | Initial comprehensive capture |

---

*"Everything's coming up Milhouse!"*

**Co-Authors**: Ansar & Claude
