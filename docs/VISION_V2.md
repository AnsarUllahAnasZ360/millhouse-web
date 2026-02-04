# Millhouse Web - Vision V2

> **Version**: 2.0.0
> **Date**: January 20, 2026
> **Status**: Draft - Research & Planning

---

## 1. Executive Summary

Millhouse Web is evolving from a collaborative productivity platform (boards, notes, todos) into a **lightweight Linear alternative** with AI-first project management capabilities. The core differentiator: **AI teammates that autonomously work on assigned tasks** using sandboxed development environments.

### Vision Statement

> A lightweight, opinionated project management platform combining the best of Linear (issues, projects, milestones), Excalidraw (whiteboards), and BlockNote (rich notes) - with the unique ability to assign tasks to AI agents that autonomously complete work and report back.

### What Changed

| Previous Vision | New Vision |
|-----------------|------------|
| Standalone boards, notes, todos | Linear-style project management |
| Workspaces with collections | Workspaces with projects, issues, milestones |
| Personal productivity focus | Team collaboration + AI teammates |
| No issue tracking | Full issue lifecycle management |
| No AI integration | Daytona + Claude Agent SDK integration |

---

## 2. Research Findings

### 2.1 Embeddable Libraries (Can Import)

| Feature | Library | Already in Stack? |
|---------|---------|-------------------|
| Whiteboards | `@excalidraw/excalidraw` | Yes |
| Rich Notes | `@blocknote/core`, `@blocknote/react` | Yes |
| Drag & Drop | `@dnd-kit/core`, `@dnd-kit/sortable` | Yes |
| Rich Text (Issues) | `tiptap` / `@tiptap/react` | No - Consider for issue descriptions |
| Kanban Board | Build with dnd-kit + shadcn/ui | Reference: [react-dnd-kit-tailwind-shadcn-ui](https://github.com/Georgegriff/react-dnd-kit-tailwind-shadcn-ui) |

### 2.2 AI Agent Infrastructure

| Component | Library | Purpose |
|-----------|---------|---------|
| Code Sandbox | `@daytonaio/sdk` | Secure sandboxed execution for AI-generated code |
| Agent SDK | `@anthropic-ai/claude-agent-sdk` | Autonomous agents that read/write files, run commands |

### 2.3 No Embeddable Library Exists For

These must be **built from scratch** (but can be kept lightweight):

- Project management data model
- Issue tracking workflows
- Milestone management
- Activity feeds
- Inbox/notifications
- Linear-style UI/UX

### 2.4 Full Applications (NOT Usable)

Researched but not applicable because they are full applications, not embeddable:

| Tool | Why Not |
|------|---------|
| Plane | Full Django/PostgreSQL app, AGPL license |
| Huly | Full Svelte/MongoDB app, different stack |
| Focalboard | Full Go/React app |

---

## 3. Product Architecture

### 3.1 Core Entities

```
Workspace (Team)
├── Members (Human users)
├── AI Team (Claude accounts, Codex, etc.)
├── Settings (GitHub integration, Daytona config)
│
├── Projects
│   ├── Description (Markdown)
│   ├── Milestones
│   ├── Issues
│   ├── Resources
│   │   ├── Boards (Excalidraw)
│   │   └── Notes (BlockNote)
│   └── Settings
│
└── Standalone Items
    ├── My Issues (personal, not in any project)
    ├── Boards (not in any project)
    └── Notes (not in any project)
```

### 3.2 Issue Lifecycle (Simplified from Linear)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   BACKLOG   │────►│   ACTIVE    │────►│  COMPLETED  │
│             │     │             │     │             │
│ • Backlog   │     │ • Todo      │     │ • Done      │
│ • Triage    │     │ • In Progress│     │ • Canceled  │
│             │     │ • In Review │     │ • Duplicate │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 3.3 Views

| View | Description |
|------|-------------|
| **My Issues** | Issues assigned to current user |
| **Active** | All active issues in workspace |
| **Backlog** | All backlog issues |
| **All Issues** | Complete issue list |
| **By Project** | Issues grouped by project |
| **Kanban** | Drag-and-drop board view |
| **List** | Traditional list view |

---

## 4. Feature Specifications

### 4.1 Core Features (MVP)

#### Workspaces
- Create/edit/delete workspaces
- Invite team members (email)
- Simple roles: Admin, Member
- Workspace settings

#### Projects
- Create/edit/archive projects
- Project description (Markdown/BlockNote)
- Project icon & color
- Start date, target date
- Project status (Planned, In Progress, Paused, Completed, Canceled)
- Priority (Urgent, High, Medium, Low, None)

#### Issues
- Create/edit/delete issues
- Title and description (rich text)
- Status workflow
- Priority
- Labels (customizable)
- Assignee (human or AI teammate)
- Due date
- Parent issue (sub-issues)
- Git branch name generation
- Activity log

#### Milestones
- Create/edit/delete milestones
- Target date
- Associated issues
- Progress tracking

#### Resources (per Project)
- Boards (Excalidraw whiteboards)
- Notes (BlockNote documents)
- Organized within project context

### 4.2 Linear-Inspired Features

#### Activity & Pulse
- Real-time activity feed
- Issue changes, comments, status updates
- Team activity dashboard

#### Inbox
- Notifications for assigned issues
- Mentions in comments
- Status changes on subscribed issues

#### Quick Actions
- Keyboard shortcuts (Cmd+K)
- Quick issue creation
- Global search

#### Favorites
- Pin frequently accessed items
- Quick navigation

### 4.3 AI Teammate Features (Differentiator)

#### AI Team Setup
- Add Claude accounts (API key)
- Add Codex accounts
- Add custom AI agents
- Configure per-agent capabilities

#### Daytona Integration
- Connect Daytona account
- Configure sandbox templates
- Set resource limits

#### GitHub Integration
- Connect GitHub repository
- Auto-create branches for issues
- PR status sync

#### AI Task Assignment
```
When issue assigned to AI teammate:
1. Check if issue has PRD/requirements
2. If missing, prompt user for input
3. Spin up Daytona sandbox
4. Start Claude Agent session
5. Stream status updates to issue
6. Report completion with deliverables
```

#### AI Status Tracking
- Real-time progress in issue view
- Log of AI actions
- Artifacts/deliverables attached to issue

---

## 5. Data Model (Convex Schema)

```typescript
// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users
  users: defineTable({
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    // Convex Auth fields
  }).index("by_email", ["email"]),

  // Workspaces
  workspaces: defineTable({
    name: v.string(),
    slug: v.string(),
    iconUrl: v.optional(v.string()),
    createdBy: v.id("users"),
  }).index("by_slug", ["slug"]),

  // Workspace Members
  workspaceMembers: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
    joinedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_user", ["userId"])
    .index("by_workspace_user", ["workspaceId", "userId"]),

  // AI Teammates
  aiTeammates: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    type: v.union(
      v.literal("claude"),
      v.literal("codex"),
      v.literal("custom")
    ),
    config: v.object({
      apiKeyEncrypted: v.string(),
      model: v.optional(v.string()),
      maxTokens: v.optional(v.number()),
    }),
    avatarUrl: v.optional(v.string()),
    isActive: v.boolean(),
  }).index("by_workspace", ["workspaceId"]),

  // Projects
  projects: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()), // Markdown
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    status: v.union(
      v.literal("planned"),
      v.literal("in_progress"),
      v.literal("paused"),
      v.literal("completed"),
      v.literal("canceled")
    ),
    priority: v.union(
      v.literal("urgent"),
      v.literal("high"),
      v.literal("medium"),
      v.literal("low"),
      v.literal("none")
    ),
    leadId: v.optional(v.id("users")),
    startDate: v.optional(v.number()),
    targetDate: v.optional(v.number()),
    githubRepo: v.optional(v.string()),
    createdBy: v.id("users"),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_slug", ["workspaceId", "slug"]),

  // Milestones
  milestones: defineTable({
    projectId: v.id("projects"),
    name: v.string(),
    description: v.optional(v.string()),
    targetDate: v.optional(v.number()),
    sortOrder: v.number(),
  }).index("by_project", ["projectId"]),

  // Labels
  labels: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    color: v.string(),
    description: v.optional(v.string()),
  }).index("by_workspace", ["workspaceId"]),

  // Issues
  issues: defineTable({
    workspaceId: v.id("workspaces"),
    projectId: v.optional(v.id("projects")),
    milestoneId: v.optional(v.id("milestones")),
    parentId: v.optional(v.id("issues")), // Sub-issues

    identifier: v.string(), // e.g., "MIL-123"
    title: v.string(),
    description: v.optional(v.string()), // Markdown/rich text

    status: v.union(
      v.literal("backlog"),
      v.literal("triage"),
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("in_review"),
      v.literal("done"),
      v.literal("canceled"),
      v.literal("duplicate")
    ),
    priority: v.union(
      v.literal("urgent"),
      v.literal("high"),
      v.literal("medium"),
      v.literal("low"),
      v.literal("none")
    ),

    // Assignment - can be user OR AI teammate
    assigneeType: v.optional(
      v.union(v.literal("user"), v.literal("ai"))
    ),
    assigneeUserId: v.optional(v.id("users")),
    assigneeAiId: v.optional(v.id("aiTeammates")),

    labelIds: v.array(v.id("labels")),
    dueDate: v.optional(v.number()),
    estimate: v.optional(v.number()), // Story points

    gitBranchName: v.optional(v.string()),

    createdBy: v.id("users"),
    sortOrder: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_project", ["projectId"])
    .index("by_milestone", ["milestoneId"])
    .index("by_parent", ["parentId"])
    .index("by_assignee_user", ["assigneeUserId"])
    .index("by_assignee_ai", ["assigneeAiId"])
    .index("by_identifier", ["workspaceId", "identifier"]),

  // Issue Relations
  issueRelations: defineTable({
    issueId: v.id("issues"),
    relatedIssueId: v.id("issues"),
    type: v.union(
      v.literal("blocks"),
      v.literal("blocked_by"),
      v.literal("related"),
      v.literal("duplicate_of")
    ),
  })
    .index("by_issue", ["issueId"])
    .index("by_related", ["relatedIssueId"]),

  // Comments
  comments: defineTable({
    issueId: v.id("issues"),
    parentId: v.optional(v.id("comments")), // Threaded
    body: v.string(), // Markdown
    createdBy: v.id("users"),
    editedAt: v.optional(v.number()),
  })
    .index("by_issue", ["issueId"])
    .index("by_parent", ["parentId"]),

  // Activity Log
  activityLogs: defineTable({
    workspaceId: v.id("workspaces"),
    issueId: v.optional(v.id("issues")),
    projectId: v.optional(v.id("projects")),

    actorType: v.union(v.literal("user"), v.literal("ai"), v.literal("system")),
    actorUserId: v.optional(v.id("users")),
    actorAiId: v.optional(v.id("aiTeammates")),

    action: v.string(), // "created", "updated", "commented", etc.
    field: v.optional(v.string()), // Field that changed
    oldValue: v.optional(v.string()),
    newValue: v.optional(v.string()),
    metadata: v.optional(v.any()),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_issue", ["issueId"])
    .index("by_project", ["projectId"]),

  // AI Task Sessions
  aiTaskSessions: defineTable({
    issueId: v.id("issues"),
    aiTeammateId: v.id("aiTeammates"),

    status: v.union(
      v.literal("pending"),
      v.literal("preparing"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("canceled")
    ),

    daytonaSandboxId: v.optional(v.string()),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),

    logs: v.array(v.object({
      timestamp: v.number(),
      type: v.union(v.literal("info"), v.literal("action"), v.literal("error")),
      message: v.string(),
    })),

    deliverables: v.array(v.object({
      type: v.string(), // "pr", "file", "artifact"
      url: v.optional(v.string()),
      name: v.string(),
      description: v.optional(v.string()),
    })),
  })
    .index("by_issue", ["issueId"])
    .index("by_status", ["status"]),

  // Boards (Excalidraw) - now project-scoped
  boards: defineTable({
    workspaceId: v.id("workspaces"),
    projectId: v.optional(v.id("projects")), // Optional - can be standalone

    name: v.string(),
    thumbnailUrl: v.optional(v.string()),
    roomId: v.string(), // excalidraw-room ID
    storageId: v.optional(v.id("_storage")),

    createdBy: v.id("users"),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_project", ["projectId"]),

  // Notes (BlockNote) - now project-scoped
  notes: defineTable({
    workspaceId: v.id("workspaces"),
    projectId: v.optional(v.id("projects")), // Optional - can be standalone

    title: v.string(),
    content: v.string(), // BlockNote JSON

    createdBy: v.id("users"),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_project", ["projectId"]),

  // Notifications/Inbox
  notifications: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),

    type: v.string(), // "assigned", "mentioned", "status_changed", etc.
    issueId: v.optional(v.id("issues")),
    actorUserId: v.optional(v.id("users")),

    title: v.string(),
    body: v.optional(v.string()),

    isRead: v.boolean(),
    readAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_unread", ["userId", "isRead"]),

  // Favorites
  favorites: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),

    itemType: v.union(
      v.literal("project"),
      v.literal("issue"),
      v.literal("board"),
      v.literal("note")
    ),
    itemId: v.string(), // Generic ID reference
    sortOrder: v.number(),
  })
    .index("by_user_workspace", ["userId", "workspaceId"]),

  // Workspace Settings
  workspaceSettings: defineTable({
    workspaceId: v.id("workspaces"),

    // GitHub
    githubInstallationId: v.optional(v.string()),
    githubOrg: v.optional(v.string()),

    // Daytona
    daytonaApiKey: v.optional(v.string()), // Encrypted
    daytonaTemplateId: v.optional(v.string()),

    // Issue settings
    issuePrefix: v.string(), // e.g., "MIL"
    nextIssueNumber: v.number(),

    // Notification settings
    googleChatWebhook: v.optional(v.string()),
    slackWebhook: v.optional(v.string()),
  }).index("by_workspace", ["workspaceId"]),
});
```

---

## 6. Technology Stack Updates

### 6.1 New Dependencies

```json
{
  "dependencies": {
    // Existing
    "@excalidraw/excalidraw": "^0.18.0",
    "@blocknote/core": "^0.46.0",
    "@blocknote/react": "^0.46.0",
    "@dnd-kit/core": "^6.3.0",
    "@dnd-kit/sortable": "^9.0.0",

    // New - AI Integration
    "@daytonaio/sdk": "latest",
    "@anthropic-ai/claude-agent-sdk": "latest",

    // New - Rich Text for Issues
    "@tiptap/react": "latest",
    "@tiptap/starter-kit": "latest",
    "@tiptap/extension-markdown": "latest",

    // New - Utilities
    "date-fns": "^3.0.0",          // Date formatting
    "cmdk": "^1.0.0"               // Command palette (Cmd+K)
  }
}
```

### 6.2 Architecture Changes

The system architecture evolves to include:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER'S BROWSER                                  │
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │                    Next.js 16 Application (Vercel)                  │    │
│   │                                                                      │    │
│   │   ┌──────────────────────────────────────────────────────────┐     │    │
│   │   │                     Linear-Style UI                        │     │    │
│   │   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐  │     │    │
│   │   │  │ Sidebar │ │ Issues  │ │ Kanban  │ │ AI Task Panel   │  │     │    │
│   │   │  │         │ │ List    │ │ Board   │ │                 │  │     │    │
│   │   │  │Projects │ │         │ │(dnd-kit)│ │ Status Stream   │  │     │    │
│   │   │  │My Issues│ │         │ │         │ │ Logs            │  │     │    │
│   │   │  │Inbox    │ │         │ │         │ │ Deliverables    │  │     │    │
│   │   │  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘  │     │    │
│   │   └──────────────────────────────────────────────────────────┘     │    │
│   │   ┌──────────────────────────────────────────────────────────┐     │    │
│   │   │                   Feature Integrations                     │     │    │
│   │   │   ┌───────────────────┐  ┌───────────────────────────┐   │     │    │
│   │   │   │ ExcalidrawWrapper │  │ BlockNoteWrapper          │   │     │    │
│   │   │   │ (Project Boards)  │  │ (Project Notes/Docs)      │   │     │    │
│   │   │   └───────────────────┘  └───────────────────────────┘   │     │    │
│   │   └──────────────────────────────────────────────────────────┘     │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│              │                          │                    │               │
└──────────────┼──────────────────────────┼────────────────────┼───────────────┘
               │                          │                    │
               ▼                          ▼                    ▼
┌──────────────────────────┐  ┌───────────────────┐  ┌───────────────────────┐
│     CONVEX BACKEND       │  │  EXCALIDRAW-ROOM  │  │    AI SERVICES        │
│                          │  │    (Cloud Run)    │  │                       │
│  Database:               │  │                   │  │  ┌─────────────────┐  │
│  - users                 │  │  Real-time sync   │  │  │   Daytona       │  │
│  - workspaces            │  │  for boards       │  │  │   Sandboxes     │  │
│  - projects              │  │                   │  │  └─────────────────┘  │
│  - issues                │  └───────────────────┘  │                       │
│  - milestones            │                         │  ┌─────────────────┐  │
│  - aiTeammates           │                         │  │ Claude Agent    │  │
│  - aiTaskSessions        │                         │  │ SDK             │  │
│  - boards                │◄────────────────────────│  └─────────────────┘  │
│  - notes                 │   Status updates        │                       │
│  - activityLogs          │   Deliverables          │  ┌─────────────────┐  │
│  - notifications         │                         │  │ GitHub API      │  │
│                          │                         │  │ (PR sync)       │  │
└──────────────────────────┘                         │  └─────────────────┘  │
                                                     └───────────────────────┘
```

---

## 7. Phased Implementation Roadmap

### Phase 0: Foundation Reset (Current)
- [ ] Finalize vision document
- [ ] Update project charter
- [ ] Define complete data schema
- [ ] Create detailed feature specs

### Phase 1: Core Infrastructure
- [ ] Update Convex schema with new tables
- [ ] Authentication (already exists)
- [ ] Workspace management (update)
- [ ] Basic routing structure

### Phase 2: Project & Issue Core
- [ ] Project CRUD
- [ ] Issue CRUD
- [ ] Status workflows
- [ ] Labels
- [ ] List view

### Phase 3: Views & Navigation
- [ ] Kanban board (dnd-kit + shadcn)
- [ ] My Issues view
- [ ] Project detail view
- [ ] Sidebar navigation
- [ ] Command palette (Cmd+K)

### Phase 4: Rich Content
- [ ] Issue description editor (Tiptap)
- [ ] Comments with threading
- [ ] Markdown support

### Phase 5: Milestones & Relations
- [ ] Milestone management
- [ ] Issue relations (blocks, related)
- [ ] Sub-issues

### Phase 6: Activity & Notifications
- [ ] Activity log
- [ ] Inbox/notifications
- [ ] Favorites

### Phase 7: Resource Integration
- [ ] Boards (Excalidraw) in projects
- [ ] Notes (BlockNote) in projects
- [ ] Resource linking to issues

### Phase 8: AI Teammate Setup
- [ ] AI teammate management UI
- [ ] API key storage (encrypted)
- [ ] Daytona configuration

### Phase 9: GitHub Integration
- [ ] GitHub OAuth/App installation
- [ ] Repository linking
- [ ] Branch name generation
- [ ] PR status sync

### Phase 10: AI Task Execution
- [ ] Task assignment flow
- [ ] Daytona sandbox creation
- [ ] Claude Agent session management
- [ ] Real-time status streaming
- [ ] Deliverable capture

### Phase 11: Polish & Launch
- [ ] Performance optimization
- [ ] Error handling
- [ ] Loading states
- [ ] Documentation
- [ ] E2E tests

---

## 8. Key Design Decisions

### 8.1 Why Not Fork Linear/Plane?

| Option | Decision | Reason |
|--------|----------|--------|
| Fork Plane | No | Different stack (Django/PostgreSQL), AGPL license |
| Fork Huly | No | Different stack (Svelte/MongoDB), EPL license |
| Use Linear SDK | No | No embeddable SDK exists |
| Build from scratch | Yes | Matches our stack, full control, AI-first design |

### 8.2 Lightweight Philosophy

- **Simple roles**: Admin, Member (no complex permissions)
- **Minimal status workflow**: 8 statuses vs Linear's unlimited
- **No sprints initially**: Just milestones
- **No time tracking**: Focus on task completion
- **No estimates required**: Optional story points
- **Keyboard-first**: Cmd+K for everything

### 8.3 AI-First Design

- Issues can be assigned to AI teammates from day one
- PRD/requirements section in issues for AI context
- Real-time streaming of AI progress
- Deliverables (PRs, files) attached to issues
- Activity log tracks AI actions

---

## 9. Open Questions

1. **Notification delivery**: Use Google Chat webhooks initially? Add Slack later?
2. **AI model selection**: Per-workspace or per-issue model selection?
3. **Sandbox templates**: How many Daytona templates to support?
4. **Offline support**: Needed for MVP?
5. **Mobile app**: When to consider Capacitor wrapper?

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Issue creation time | < 5 seconds |
| AI task assignment to start | < 30 seconds |
| Kanban drag performance | 60fps |
| First contentful paint | < 1 second |
| Time to interactive | < 2 seconds |

---

## 11. References

### Research Sources

- [Linear](https://linear.app) - Primary inspiration
- [Plane](https://github.com/makeplane/plane) - Open source reference
- [Huly](https://github.com/hcengineering/platform) - Open source reference
- [Daytona](https://github.com/daytonaio/daytona) - AI sandbox infrastructure
- [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk-typescript) - Agent capabilities
- [dnd-kit Kanban](https://github.com/Georgegriff/react-dnd-kit-tailwind-shadcn-ui) - Kanban pattern

### Documentation

- [Daytona SDK Docs](https://www.daytona.io/docs/en/)
- [Claude Agent SDK Docs](https://docs.claude.com/en/api/agent-sdk/typescript)
- [Tiptap Docs](https://tiptap.dev/docs/editor/getting-started/install/react)

---

*Document Version: 2.0.0 | January 20, 2026*
