# Millhouse: Comprehensive Research Proposal

> **Version**: 1.0.0
> **Date**: February 3, 2026
> **Status**: Phase 1 Complete - Research Synthesis
> **Author**: Strategic Research Initiative

---

## Executive Summary

This document synthesizes extensive research into building **Millhouse** - a unified software development tool that combines project management, documentation, whiteboarding, and AI agent orchestration. The core philosophy: **extremely simple, extremely well-crafted, extremely thoughtful**.

### The Vision in One Sentence

> A lightweight, opinionated development platform where you brainstorm on whiteboards, document your thinking, track work in a Linear-style interface, and delegate coding tasks to AI agents that autonomously execute in isolated cloud environments.

### Key Differentiators

1. **AI-First Architecture**: Issues can be assigned to AI teammates from day one
2. **Unified Workspace**: Whiteboard, document, plan, and execute in one place
3. **Opinionated Simplicity**: Fewer features, done exceptionally well
4. **Cloud-Native AI Execution**: Daytona sandboxes + Claude Agent SDK for autonomous work

---

## Part 1: Design Philosophy

### 1.1 The Linear Design DNA

Linear has established the gold standard for developer-focused project management. Our research reveals their core design principles:

**Keyboard-First Interface**
- Every action accessible via keyboard shortcut
- Cmd+K command palette is the universal entry point
- No action should require more than 3 keystrokes

**Information Density Without Clutter**
- Show maximum information in minimum space
- No gratuitous whitespace or decorative elements
- Every pixel earns its place

**Speed as a Feature**
- Page transitions under 300ms
- Optimistic UI updates (show changes before server confirms)
- 60fps animations, always

**Opinionated Defaults**
- One right way to do things, not infinite flexibility
- Progressive disclosure: simple by default, powerful when needed
- Remove features rather than add configuration

### 1.2 The "Minimum Viable Elegance" Principle

For Millhouse, we propose **Minimum Viable Elegance (MVE)**:

```
MVE = Fewest features that deliver complete value,
      implemented with exceptional craft
```

**What this means in practice:**

| Include | Exclude |
|---------|---------|
| Issues with status workflow | Time tracking |
| Projects with milestones | Sprints/cycles (initially) |
| Kanban board | Gantt charts |
| Simple roles (Admin/Member) | Complex permissions |
| One notification channel | Multi-channel notification builder |
| AI task assignment | AI configuration complexity |

### 1.3 UI/UX Patterns from Research

**From Linear:**
- Collapsible sidebar with workspace/project hierarchy
- Issue detail as slide-over panel, not separate page
- Status badges with semantic colors
- Inline editing everywhere

**From Notion:**
- Block-based document editing
- Slash commands for inserting content
- Nested page structure (we use: Workspace > Project > Resources)

**From Vercel/Raycast:**
- Monochromatic with strategic accent colors
- Inter or similar geometric sans-serif typography
- Generous spacing in cards, tight spacing in lists
- Subtle shadows instead of borders

**From OpenAI:**
- Streaming UI for real-time AI responses
- Progress indicators that show actual progress
- Elegant error states that guide users forward

---

## Part 2: Core Architecture

### 2.1 Entity Hierarchy

```
Workspace
├── Members (Human users)
├── AI Team (Claude, Codex, Custom agents)
├── Settings
│   ├── General (name, slug, icon)
│   ├── Labels (workspace-wide)
│   ├── Integrations (GitHub, Daytona)
│   └── AI Configuration
│
├── Projects
│   ├── Overview (description, progress, activity)
│   ├── Issues (the work items)
│   ├── Milestones (groupings of issues with target dates)
│   └── Resources
│       ├── Boards (Excalidraw whiteboards)
│       └── Notes (BlockNote documents)
│
└── Standalone Items (not tied to projects)
    ├── My Issues (personal tasks)
    ├── Boards
    └── Notes
```

### 2.2 Issue Lifecycle (Simplified)

We deliberately simplify Linear's extensive status system:

```
┌─────────────────────────────────────────────────────────────┐
│                     ISSUE LIFECYCLE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────┐                                               │
│   │ BACKLOG │  Issues waiting to be worked on               │
│   └────┬────┘                                               │
│        │                                                     │
│        ▼                                                     │
│   ┌─────────┐                                               │
│   │  TODO   │  Ready to start                               │
│   └────┬────┘                                               │
│        │                                                     │
│        ▼                                                     │
│   ┌─────────────┐                                           │
│   │ IN PROGRESS │  Actively being worked on                 │
│   └──────┬──────┘                                           │
│          │                                                   │
│          ▼                                                   │
│   ┌─────────────┐                                           │
│   │  IN REVIEW  │  Awaiting code review/approval            │
│   └──────┬──────┘                                           │
│          │                                                   │
│          ├─────────────────┐                                │
│          ▼                 ▼                                │
│   ┌──────────┐      ┌──────────┐                            │
│   │   DONE   │      │ CANCELED │                            │
│   └──────────┘      └──────────┘                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Why 6 statuses, not 8+:**
- Fewer cognitive decisions
- Clearer automation triggers
- Easier board visualization

### 2.3 Data Model (Convex Schema)

```typescript
// Core Tables - Simplified for MVE

// Workspaces
workspaces: defineTable({
  name: v.string(),
  slug: v.string(),
  iconUrl: v.optional(v.string()),
  issuePrefix: v.string(), // e.g., "MIL"
  nextIssueNumber: v.number(),
  createdBy: v.id("users"),
}).index("by_slug", ["slug"]),

// Projects
projects: defineTable({
  workspaceId: v.id("workspaces"),
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  icon: v.optional(v.string()),
  color: v.optional(v.string()),
  status: v.union(
    v.literal("planned"),
    v.literal("in_progress"),
    v.literal("completed"),
    v.literal("canceled")
  ),
  priority: v.union(
    v.literal("high"),
    v.literal("medium"),
    v.literal("low"),
    v.literal("none")
  ),
  targetDate: v.optional(v.number()),
  githubRepo: v.optional(v.string()),
  createdBy: v.id("users"),
}).index("by_workspace", ["workspaceId"]),

// Issues - The heart of the system
issues: defineTable({
  workspaceId: v.id("workspaces"),
  projectId: v.optional(v.id("projects")),
  milestoneId: v.optional(v.id("milestones")),
  parentId: v.optional(v.id("issues")),

  identifier: v.string(), // "MIL-42"
  title: v.string(),
  description: v.optional(v.string()),

  status: v.union(
    v.literal("backlog"),
    v.literal("todo"),
    v.literal("in_progress"),
    v.literal("in_review"),
    v.literal("done"),
    v.literal("canceled")
  ),
  priority: v.union(
    v.literal("urgent"),
    v.literal("high"),
    v.literal("medium"),
    v.literal("low"),
    v.literal("none")
  ),

  // Assignment - human OR AI
  assigneeType: v.optional(v.union(v.literal("user"), v.literal("ai"))),
  assigneeUserId: v.optional(v.id("users")),
  assigneeAiId: v.optional(v.id("aiTeammates")),

  labelIds: v.array(v.id("labels")),
  dueDate: v.optional(v.number()),
  sortOrder: v.number(),
  createdBy: v.id("users"),
})
  .index("by_workspace", ["workspaceId"])
  .index("by_project", ["projectId"])
  .index("by_assignee_user", ["assigneeUserId"])
  .index("by_assignee_ai", ["assigneeAiId"]),

// AI Teammates
aiTeammates: defineTable({
  workspaceId: v.id("workspaces"),
  name: v.string(),
  type: v.union(v.literal("claude"), v.literal("codex"), v.literal("custom")),
  avatarUrl: v.optional(v.string()),
  isActive: v.boolean(),
  config: v.object({
    model: v.string(),
    maxBudgetUsd: v.number(),
    systemPrompt: v.optional(v.string()),
  }),
}).index("by_workspace", ["workspaceId"]),

// AI Task Sessions - Track autonomous execution
aiTaskSessions: defineTable({
  issueId: v.id("issues"),
  aiTeammateId: v.id("aiTeammates"),

  status: v.union(
    v.literal("pending"),
    v.literal("preparing"),
    v.literal("running"),
    v.literal("completed"),
    v.literal("failed")
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
    type: v.string(),
    url: v.optional(v.string()),
    name: v.string(),
  })),

  tokensUsed: v.optional(v.number()),
  costUsd: v.optional(v.number()),
}).index("by_issue", ["issueId"]),

// Boards (Excalidraw)
boards: defineTable({
  workspaceId: v.id("workspaces"),
  projectId: v.optional(v.id("projects")),
  name: v.string(),
  roomId: v.string(), // excalidraw-room ID
  thumbnailStorageId: v.optional(v.id("_storage")),
  dataStorageId: v.optional(v.id("_storage")),
  createdBy: v.id("users"),
}).index("by_project", ["projectId"]),

// Notes (BlockNote)
notes: defineTable({
  workspaceId: v.id("workspaces"),
  projectId: v.optional(v.id("projects")),
  title: v.string(),
  content: v.string(), // BlockNote JSON
  createdBy: v.id("users"),
}).index("by_project", ["projectId"]),
```

---

## Part 3: Feature Integrations

### 3.1 Excalidraw Integration

**Research Summary:**
Excalidraw provides a first-class React component that can be fully embedded and customized.

**Integration Pattern:**

```typescript
// ExcalidrawWrapper.tsx - Simplified integration

import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";

interface BoardProps {
  boardId: string;
  roomId: string;
  initialData?: ExcalidrawDataState;
  onSave: (data: ExcalidrawDataState) => Promise<void>;
}

export function ExcalidrawBoard({ boardId, roomId, initialData, onSave }: BoardProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);

  // Auto-save on changes (debounced)
  const handleChange = useCallback(
    debounce((elements: ExcalidrawElement[], appState: AppState) => {
      onSave({ elements, appState });
    }, 2000),
    [onSave]
  );

  return (
    <div className="h-full w-full">
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        initialData={initialData}
        onChange={handleChange}
        UIOptions={{
          canvasActions: {
            loadScene: false, // Disable file loading
            export: { saveFileToDisk: true },
          },
        }}
      >
        <MainMenu>
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.Export />
          <MainMenu.Separator />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
        </MainMenu>
        <WelcomeScreen>
          <WelcomeScreen.Center>
            <WelcomeScreen.Center.Heading>
              Start brainstorming
            </WelcomeScreen.Center.Heading>
          </WelcomeScreen.Center>
        </WelcomeScreen>
      </Excalidraw>
    </div>
  );
}
```

**Real-time Collaboration:**
Use `excalidraw-room` server (deployed to Cloud Run) for cursor presence and element sync:

```typescript
// Collaboration hook
function useExcalidrawCollaboration(roomId: string, excalidrawAPI: ExcalidrawImperativeAPI) {
  useEffect(() => {
    const socket = io(EXCALIDRAW_ROOM_URL);

    socket.emit("join-room", roomId);

    socket.on("scene-update", (elements) => {
      excalidrawAPI.updateScene({ elements });
    });

    socket.on("collaborator-update", (collaborators) => {
      excalidrawAPI.updateScene({ collaborators });
    });

    return () => socket.disconnect();
  }, [roomId, excalidrawAPI]);
}
```

**Key UX Decisions:**
- Boards live within projects (or standalone)
- Auto-save every 2 seconds
- Generate thumbnail on save for gallery view
- Export to PNG/SVG available from menu

### 3.2 BlockNote Integration

**Research Summary:**
BlockNote provides a Notion-style block editor with built-in collaboration support.

**Integration Pattern:**

```typescript
// NoteEditor.tsx - Simplified integration

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";

interface NoteEditorProps {
  noteId: string;
  initialContent?: Block[];
  onSave: (content: Block[]) => Promise<void>;
}

export function NoteEditor({ noteId, initialContent, onSave }: NoteEditorProps) {
  const editor = useCreateBlockNote({
    initialContent,
  });

  // Auto-save on content change
  useEffect(() => {
    const unsubscribe = editor.onEditorContentChange(() => {
      const content = editor.document;
      debouncedSave(content);
    });
    return unsubscribe;
  }, [editor]);

  return (
    <BlockNoteView
      editor={editor}
      theme="light" // or "dark" based on app theme
      slashMenu={true}
      formattingToolbar={true}
    />
  );
}
```

**Custom Blocks (Future Enhancement):**

```typescript
// Issue mention block
const IssueMentionBlock = createReactBlockSpec({
  type: "issueMention",
  propSchema: {
    issueId: { default: "" },
  },
  content: "none",
});

// Board embed block
const BoardEmbedBlock = createReactBlockSpec({
  type: "boardEmbed",
  propSchema: {
    boardId: { default: "" },
  },
  content: "none",
});
```

**Key UX Decisions:**
- Notes live within projects (or standalone)
- Slash commands for quick formatting
- Auto-save on every keystroke (debounced)
- Markdown import/export supported

### 3.3 dnd-kit Kanban Implementation

**Research Summary:**
dnd-kit provides accessible, performant drag-and-drop with full keyboard support.

**Implementation Pattern:**

```typescript
// KanbanBoard.tsx - Accessible kanban

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const STATUS_COLUMNS = ["backlog", "todo", "in_progress", "in_review", "done"];

export function KanbanBoard({ issues }: { issues: Issue[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const issuesByStatus = useMemo(() => {
    return STATUS_COLUMNS.reduce((acc, status) => {
      acc[status] = issues.filter(i => i.status === status);
      return acc;
    }, {} as Record<string, Issue[]>);
  }, [issues]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIssue = issues.find(i => i._id === active.id);
    const overColumn = STATUS_COLUMNS.find(s =>
      issuesByStatus[s].some(i => i._id === over.id) || over.id === s
    );

    if (activeIssue && overColumn && activeIssue.status !== overColumn) {
      // Optimistic update
      updateIssueStatus(activeIssue._id, overColumn);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-4 h-full overflow-x-auto p-4">
        {STATUS_COLUMNS.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            issues={issuesByStatus[status]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId ? <IssueCard issue={issues.find(i => i._id === activeId)!} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
```

**Accessibility Features:**
- Full keyboard navigation (Tab, Arrow keys, Space, Enter)
- Screen reader announcements for drag operations
- Focus management during and after drag
- Visual focus indicators

**Performance Optimizations:**
- Virtualization for large lists (react-window)
- Memoized issue cards
- Optimistic updates with rollback on error

---

## Part 4: AI Agent Integration

### 4.1 Daytona SDK Integration

**Research Summary:**
Daytona provides secure, isolated sandbox environments for executing AI-generated code.

**Core Integration:**

```typescript
// lib/daytona.ts

import { Daytona } from "@daytonaio/sdk";

const daytona = new Daytona();

export interface SandboxConfig {
  language: "typescript" | "python" | "go";
  resources?: {
    cpu?: number;
    memory?: number;
    disk?: number;
  };
  envVars?: Record<string, string>;
  githubRepo?: string;
  githubToken?: string;
}

export async function createSandbox(config: SandboxConfig) {
  const sandbox = await daytona.create({
    language: config.language,
    envVars: {
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      ...config.envVars,
    },
    resources: config.resources || { cpu: 2, memory: 4, disk: 8 },
  });

  // Clone repository if specified
  if (config.githubRepo) {
    await sandbox.git.clone(
      config.githubRepo,
      "/workspace/repo",
      undefined, // branch (default)
      undefined, // commit (latest)
      "git",
      config.githubToken
    );
  }

  return sandbox;
}

export async function executeSandboxCommand(
  sandbox: Sandbox,
  command: string
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const result = await sandbox.process.executeCommand(command, {
    cwd: "/workspace/repo",
    timeout: 300000, // 5 minutes
  });

  return {
    stdout: result.stdout,
    stderr: result.stderr,
    exitCode: result.exitCode,
  };
}

export async function cleanupSandbox(sandbox: Sandbox) {
  await sandbox.delete();
}
```

**Sandbox Lifecycle:**

```
┌──────────────────────────────────────────────────────────────────┐
│                    SANDBOX LIFECYCLE                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Issue Assigned to AI                                            │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────┐                                                 │
│  │  PREPARING  │  Validate issue context, check quotas           │
│  └──────┬──────┘                                                 │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────┐                                                 │
│  │  CREATING   │  daytona.create() + git clone                   │
│  └──────┬──────┘                                                 │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────┐                                                 │
│  │   RUNNING   │  Agent executes, logs stream to UI              │
│  └──────┬──────┘                                                 │
│         │                                                         │
│    ┌────┴────┐                                                   │
│    ▼         ▼                                                   │
│ ┌──────┐  ┌────────┐                                             │
│ │ DONE │  │ FAILED │                                             │
│ └──┬───┘  └───┬────┘                                             │
│    │          │                                                   │
│    └────┬─────┘                                                   │
│         ▼                                                         │
│  ┌─────────────┐                                                 │
│  │  CLEANUP    │  Archive/delete sandbox                         │
│  └─────────────┘                                                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 Claude Agent SDK Integration

**Research Summary:**
The Claude Agent SDK enables autonomous coding agents with tool use (file operations, bash commands, web search).

**Core Integration:**

```typescript
// lib/claude-agent.ts

import { query } from "@anthropic-ai/claude-agent-sdk";

export interface AgentConfig {
  model?: "opus" | "sonnet" | "haiku";
  maxTurns?: number;
  maxBudgetUsd?: number;
  systemPrompt?: string;
  allowedTools?: string[];
  permissionMode?: "default" | "acceptEdits" | "bypassPermissions";
}

export async function* executeAgent(
  prompt: string,
  config: AgentConfig,
  cwd: string
) {
  const allowedTools = config.allowedTools || [
    "Read",
    "Edit",
    "Write",
    "Bash",
    "Glob",
    "Grep",
  ];

  for await (const message of query({
    prompt,
    options: {
      model: config.model || "sonnet",
      cwd,
      allowedTools,
      permissionMode: config.permissionMode || "acceptEdits",
      maxTurns: config.maxTurns || 100,
      maxBudgetUsd: config.maxBudgetUsd || 5.0,
      systemPrompt: config.systemPrompt,
    },
  })) {
    yield message;
  }
}
```

**AI Task Execution Flow:**

```typescript
// convex/aiTasks.ts

export const executeAiTask = internalAction({
  args: {
    issueId: v.id("issues"),
    aiTeammateId: v.id("aiTeammates"),
  },
  handler: async (ctx, { issueId, aiTeammateId }) => {
    const issue = await ctx.runQuery(internal.issues.get, { id: issueId });
    const aiTeammate = await ctx.runQuery(internal.aiTeammates.get, { id: aiTeammateId });
    const project = issue.projectId
      ? await ctx.runQuery(internal.projects.get, { id: issue.projectId })
      : null;

    // 1. Create session record
    const sessionId = await ctx.runMutation(internal.aiTaskSessions.create, {
      issueId,
      aiTeammateId,
      status: "preparing",
    });

    try {
      // 2. Create Daytona sandbox
      const sandbox = await createSandbox({
        language: "typescript",
        githubRepo: project?.githubRepo,
        githubToken: process.env.GITHUB_TOKEN,
      });

      await ctx.runMutation(internal.aiTaskSessions.update, {
        id: sessionId,
        daytonaSandboxId: sandbox.id,
        status: "running",
        startedAt: Date.now(),
      });

      // 3. Build context prompt
      const prompt = buildAgentPrompt(issue, project);

      // 4. Execute agent with streaming
      for await (const message of executeAgent(
        prompt,
        aiTeammate.config,
        "/workspace/repo"
      )) {
        // 5. Log to activity stream
        if (message.type === "assistant") {
          await ctx.runMutation(internal.aiTaskSessions.addLog, {
            id: sessionId,
            log: {
              timestamp: Date.now(),
              type: "action",
              message: summarizeAgentMessage(message),
            },
          });
        }

        if (message.type === "result") {
          if (!message.is_error) {
            // 6. Capture deliverables
            const deliverables = await captureDeliverables(sandbox);

            await ctx.runMutation(internal.aiTaskSessions.complete, {
              id: sessionId,
              deliverables,
              tokensUsed: message.usage?.total_tokens,
              costUsd: calculateCost(message.usage),
            });

            // 7. Update issue status
            await ctx.runMutation(internal.issues.update, {
              id: issueId,
              status: "in_review",
            });
          } else {
            throw new Error(message.errors.join("\n"));
          }
        }
      }
    } catch (error) {
      await ctx.runMutation(internal.aiTaskSessions.fail, {
        id: sessionId,
        error: error.message,
      });
    } finally {
      // 8. Cleanup sandbox (after delay for debugging)
      // Scheduled cleanup after 1 hour
    }
  },
});

function buildAgentPrompt(issue: Issue, project: Project | null): string {
  return `
You are an AI developer working on issue ${issue.identifier}: ${issue.title}

## Requirements
${issue.description || "No detailed description provided."}

## Repository
${project?.githubRepo || "No repository linked."}

## Instructions
1. Read and understand the existing codebase structure
2. Implement the required changes
3. Write tests for your changes
4. Ensure all existing tests pass
5. Create a commit with message: "${issue.identifier}: ${issue.title}"
6. Push to a new branch: ${generateBranchName(issue)}
7. Create a pull request

## Constraints
- Follow existing code style and patterns
- Do not modify unrelated files
- Keep changes minimal and focused
  `.trim();
}
```

### 4.3 AI Task Session UI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ AI Session: MIL-42                                              [Stop Task] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Agent: Claude Sonnet 4.5              Status: ● Running                    │
│  Started: 2 minutes ago                Cost: $0.47                          │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Live Activity                                                               │
│  ──────────────                                                              │
│                                                                              │
│  14:52:01  Reading codebase structure...                                    │
│  14:52:08  Found relevant files: src/auth/login.ts, src/auth/token.ts       │
│  14:52:15  Analyzing authentication flow                                    │
│  14:52:32  Editing: src/auth/login.ts                                       │
│            + Added token refresh logic                                      │
│            + Fixed expiration check                                         │
│  14:52:45  Running: bun test                                                │
│  14:53:02  All 47 tests passing                                             │
│  14:53:10  Creating commit...                                               │
│  14:53:15  Pushing to branch: ansar/mil-42-fix-token-refresh                │
│  14:53:22  Creating pull request...                                         │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Deliverables                                                                │
│  ────────────                                                                │
│                                                                              │
│  [ PR #142 ] Fix token refresh in login flow                                │
│              +42 / -12 lines | 2 files changed                              │
│                                                                              │
│  [ File ] src/auth/login.ts (modified)                                      │
│  [ File ] src/auth/__tests__/login.test.ts (modified)                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Part 5: User Interface Wireframes

### 5.1 Main Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Millhouse                                              [Cmd+K]    [@user]  │
├────────────────┬────────────────────────────────────────────────────────────┤
│                │                                                             │
│  WORKSPACE     │                    MAIN CONTENT AREA                        │
│  ──────────    │                                                             │
│                │   (Issue List / Kanban / Board / Note / Project)            │
│  [ Inbox (3) ] │                                                             │
│  [ My Issues ] │                                                             │
│                │                                                             │
│  ──────────    │                                                             │
│  Issues        │                                                             │
│  [ Active    ] │                                                             │
│  [ Backlog   ] │                                                             │
│                │                                                             │
│  ──────────    │                                                             │
│  Projects      │                                                             │
│  [ Project A ] │                                                             │
│  [ Project B ] │                                                             │
│  [ + New    ]  │                                                             │
│                │                                                             │
│  ──────────    │                                                             │
│  AI Team       │                                                             │
│  [ Claude    ] │                                                             │
│  [ + Add AI  ] │                                                             │
│                │                                                             │
│  ──────────    │                                                             │
│  [ Settings  ] │                                                             │
│                │                                                             │
└────────────────┴────────────────────────────────────────────────────────────┘
```

### 5.2 Issue List View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Active Issues                                      [Filter] [Sort] [Board] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ☐  MIL-1   Fix authentication bug                                         │
│      ● Urgent    In Progress    @john    Project A    Due Feb 5            │
│                                                                              │
│  ☐  MIL-2   Add dark mode toggle                                           │
│      ○ Medium    Todo          @claude   Project A                          │
│                                                                              │
│  ☐  MIL-3   Update API documentation                                       │
│      ○ Low       Backlog       --        Project B                          │
│                                                                              │
│  ☐  MIL-4   Refactor payment flow                                          │
│      ○ High      In Review     @jane     Project A    Due Feb 10           │
│                                                                              │
│  ───────────────────────────────────────────────────────────────────────    │
│  Press 'c' to create issue, '/' to search, '?' for shortcuts                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Kanban Board View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Project A / Board                                  [Filter] [Sort] [List]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  BACKLOG (3)     TODO (2)        IN PROGRESS (1)   IN REVIEW (1)   DONE (5) │
│  ───────────     ─────────       ───────────────   ─────────────   ──────── │
│                                                                              │
│  ┌───────────┐   ┌───────────┐   ┌───────────┐    ┌───────────┐            │
│  │ MIL-3     │   │ MIL-2     │   │ MIL-1     │    │ MIL-4     │            │
│  │ Update    │   │ Add dark  │   │ Fix auth  │    │ Refactor  │            │
│  │ docs      │   │ mode      │   │ bug       │    │ payments  │            │
│  │           │   │           │   │           │    │           │            │
│  │ ○ Low     │   │ ○ Medium  │   │ ● Urgent  │    │ ○ High    │            │
│  │           │   │ @claude   │   │ @john     │    │ @jane     │            │
│  └───────────┘   └───────────┘   └───────────┘    └───────────┘            │
│                                                                              │
│  ┌───────────┐   ┌───────────┐                                              │
│  │ MIL-7     │   │ MIL-8     │                                              │
│  │ ...       │   │ ...       │                                              │
│  └───────────┘   └───────────┘                                              │
│                                                                              │
│  ┌───────────┐                                                              │
│  │ MIL-9     │                                                              │
│  │ ...       │                                                              │
│  └───────────┘                                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.4 Issue Detail Panel

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  MIL-1                                                              [Close] │
│  ═══════════════════════════════════════════════════════════════════════════│
│  Fix authentication bug                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Description                          │  Properties                         │
│  ───────────                          │  ──────────                         │
│                                       │                                      │
│  Users are unable to log in when      │  Status     [ In Progress   v]      │
│  their session token expires. The     │  Priority   [ Urgent        v]      │
│  token refresh logic is not being     │  Assignee   [ @john         v]      │
│  triggered correctly.                 │  Project    [ Project A     v]      │
│                                       │  Milestone  [ v1.0 Release  v]      │
│  **Steps to reproduce:**              │  Due Date   [ Feb 5, 2026   v]      │
│  1. Log in to the application        │  Labels     [ Bug, Auth       ]      │
│  2. Wait for token to expire (1hr)   │                                      │
│  3. Try to perform any action        │  ──────────                         │
│  4. Observe 401 error                │                                      │
│                                       │  Git Branch                          │
│  **Expected:**                        │  ansar/mil-1-fix-auth-bug           │
│  Token should refresh automatically   │  [Copy]                              │
│                                       │                                      │
├───────────────────────────────────────┴──────────────────────────────────────┤
│                                                                              │
│  Activity                                                                    │
│  ────────                                                                    │
│                                                                              │
│  2h ago   John changed status: Todo -> In Progress                          │
│  3h ago   Jane assigned to John                                             │
│  1d ago   Jane created this issue                                           │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Add a comment...                                                      │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.5 Project Resources View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Project A / Resources                               [+ Board]  [+ Note]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Boards                                                                      │
│  ──────                                                                      │
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │                 │  │                 │  │                 │              │
│  │  [thumbnail]    │  │  [thumbnail]    │  │  [thumbnail]    │              │
│  │                 │  │                 │  │                 │              │
│  │  Architecture   │  │  User Flows     │  │  Wireframes     │              │
│  │  Updated 2h ago │  │  Updated 1d ago │  │  Updated 3d ago │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                              │
│                                                                              │
│  Notes                                                                       │
│  ─────                                                                       │
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                                   │
│  │ [ ]             │  │ [ ]             │                                   │
│  │ PRD: Auth       │  │ Meeting Notes   │                                   │
│  │ System          │  │ Jan 15          │                                   │
│  │                 │  │                 │                                   │
│  │ Updated 1d ago  │  │ Updated 5d ago  │                                   │
│  └─────────────────┘  └─────────────────┘                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.6 Command Palette

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                    ┌─────────────────────────────────────┐                  │
│                    │  > Search issues, commands...       │                  │
│                    ├─────────────────────────────────────┤                  │
│                    │                                     │                  │
│                    │  Recent                             │                  │
│                    │  ───────                            │                  │
│                    │  [ ] MIL-1  Fix authentication bug  │                  │
│                    │  [ ] Project A                      │                  │
│                    │  [ ] Architecture Board             │                  │
│                    │                                     │                  │
│                    │  Actions                            │                  │
│                    │  ───────                            │                  │
│                    │  [c] Create new issue               │                  │
│                    │  [p] Go to projects                 │                  │
│                    │  [i] Go to inbox                    │                  │
│                    │  [s] Go to settings                 │                  │
│                    │                                     │                  │
│                    │  Press Esc to close                 │                  │
│                    └─────────────────────────────────────┘                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Part 6: Technology Stack Validation

### 6.1 Core Stack (Confirmed)

| Technology | Version | Status | Notes |
|------------|---------|--------|-------|
| TypeScript | 5.7+ | Confirmed | Strict mode enabled |
| React | 19.x | Confirmed | Concurrent features |
| Next.js | 15.x | Confirmed | App Router, Turbopack |
| Convex | 1.18+ | Confirmed | Real-time, serverless |
| Tailwind CSS | 4.x | Confirmed | CSS-first config |
| shadcn/ui | Latest | Confirmed | Radix primitives |
| Bun | 1.1+ | Confirmed | Package manager, runtime |

### 6.2 Feature Libraries (Confirmed)

| Feature | Library | Status | Notes |
|---------|---------|--------|-------|
| Whiteboarding | @excalidraw/excalidraw 0.18+ | Confirmed | Full React integration |
| Collaboration | excalidraw-room | Confirmed | Cloud Run deployment |
| Documents | @blocknote/react 0.46+ | Confirmed | Notion-style editor |
| Drag & Drop | @dnd-kit/core + sortable | Confirmed | Accessible, performant |
| Command Palette | cmdk 1.0+ | Confirmed | Linear-style |
| Date Handling | date-fns 3.0+ | Confirmed | Lightweight |

### 6.3 AI Integration (Confirmed)

| Component | Library | Status | Notes |
|-----------|---------|--------|-------|
| Sandboxes | @daytonaio/sdk | Confirmed | Isolated execution |
| AI Agent | @anthropic-ai/claude-agent-sdk | Confirmed | Autonomous coding |

### 6.4 Dependencies Summary

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "convex": "^1.18.0",
    "@convex-dev/auth": "^0.0.80",
    "tailwindcss": "^4.0.0",
    "@excalidraw/excalidraw": "^0.18.0",
    "socket.io-client": "^4.8.0",
    "@blocknote/core": "^0.46.0",
    "@blocknote/react": "^0.46.0",
    "@dnd-kit/core": "^6.3.0",
    "@dnd-kit/sortable": "^9.0.0",
    "@daytonaio/sdk": "latest",
    "@anthropic-ai/claude-agent-sdk": "latest",
    "cmdk": "^1.0.0",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.469.0",
    "next-themes": "^0.4.0",
    "sonner": "^1.7.0"
  }
}
```

---

## Part 7: Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goal:** Basic infrastructure and auth

- [ ] Set up Next.js 15 with App Router
- [ ] Configure Convex with auth
- [ ] Implement workspace creation
- [ ] Basic routing structure
- [ ] Theme system (light/dark)

**Deliverable:** User can create account, create workspace, see empty dashboard

### Phase 2: Core Issues (Week 3-4)

**Goal:** Issue CRUD and basic views

- [ ] Issue schema and mutations
- [ ] Issue list view
- [ ] Issue detail panel
- [ ] Status workflow
- [ ] Labels and priorities
- [ ] Keyboard shortcuts (c, /, Cmd+K)

**Deliverable:** User can create, view, edit issues

### Phase 3: Projects & Kanban (Week 5-6)

**Goal:** Project management and kanban

- [ ] Project CRUD
- [ ] Milestone management
- [ ] Kanban board with dnd-kit
- [ ] Project detail view
- [ ] Issue filtering

**Deliverable:** User can organize issues into projects, use kanban

### Phase 4: Resources (Week 7-8)

**Goal:** Boards and notes integration

- [ ] Excalidraw integration
- [ ] Board CRUD
- [ ] Real-time collaboration setup
- [ ] BlockNote integration
- [ ] Note CRUD

**Deliverable:** User can create whiteboards and documents

### Phase 5: AI Integration (Week 9-10)

**Goal:** AI teammate functionality

- [ ] AI teammate management UI
- [ ] Daytona configuration
- [ ] Claude Agent SDK integration
- [ ] Task execution flow
- [ ] Status streaming
- [ ] Deliverable capture

**Deliverable:** User can assign issues to AI and watch execution

### Phase 6: Polish (Week 11-12)

**Goal:** Production readiness

- [ ] Command palette (cmdk)
- [ ] Notifications/inbox
- [ ] Activity feed
- [ ] Performance optimization
- [ ] Error handling
- [ ] E2E tests

**Deliverable:** Production-ready MVP

---

## Part 8: Success Metrics

### Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.0s |
| Time to Interactive | < 2.0s |
| Issue List Render (100 items) | < 50ms |
| Kanban Drag | 60fps |
| Page Navigation | < 300ms |
| Command Palette Open | < 50ms |
| AI Task Start | < 30s |

### Quality Gates

- TypeScript strict mode: zero errors
- Biome lint: zero warnings
- Test coverage: > 80% for business logic
- Lighthouse score: > 90 performance
- Accessibility: WCAG 2.1 AA compliant

---

## Part 9: Open Questions

### Product Decisions

1. **Cycles/Sprints**: Include in MVP or defer?
   - Recommendation: Defer to post-MVP

2. **Teams**: Multi-team workspaces in MVP?
   - Recommendation: Single team per workspace for MVP

3. **Templates**: Issue/project templates in MVP?
   - Recommendation: Defer to post-MVP

### Technical Decisions

1. **Real-time Collaboration**: Yjs vs custom for notes?
   - Recommendation: Start without collab, add Yjs later

2. **File Storage**: Convex storage vs external (R2/S3)?
   - Recommendation: Convex storage for MVP simplicity

3. **AI Cost Management**: Per-task limits vs workspace budgets?
   - Recommendation: Per-task limits with workspace totals

---

## Conclusion

Millhouse represents an ambitious but achievable vision: a unified tool for modern software development that combines the best of Linear's project management, Notion's documentation, Excalidraw's whiteboarding, and introduces AI-powered autonomous development.

The key to success is maintaining the **Minimum Viable Elegance** principle throughout implementation: fewer features, exceptional craft. Every interaction should feel intentional, every UI element should earn its place, and the AI integration should feel magical rather than complex.

With the validated tech stack and phased implementation plan, Millhouse can move from research to reality in 12 weeks.

---

*Document Version: 1.0.0 | February 3, 2026*
