# Millhouse Web - Feature Specifications

> **Version**: 2.0.0
> **Date**: January 20, 2026
> **Status**: Draft

---

## 1. Workspace Management

### 1.1 Create Workspace

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Name | String | Yes | Workspace display name |
| Slug | String | Auto | URL-friendly identifier (auto from name) |
| Icon | Upload | No | Workspace avatar/logo |

**Behavior**:
- Creator becomes Admin
- Generate unique slug from name
- Create default labels (Bug, Feature, Improvement)
- Create default issue prefix from name

### 1.2 Workspace Settings

| Section | Settings |
|---------|----------|
| General | Name, icon, issue prefix |
| Members | Invite, remove, change roles |
| AI Team | Add/remove AI teammates |
| Integrations | GitHub, Daytona, Notifications |
| Billing | Future: Stripe integration |

### 1.3 Member Roles

| Role | Permissions |
|------|-------------|
| Admin | All permissions, manage members, delete workspace |
| Member | Create/edit issues, projects; cannot manage members |

### 1.4 Invite Flow

```
Admin clicks "Invite" → Enter email → Generate invite link
Invitee clicks link → Signs in → Added to workspace
```

---

## 2. Project Management

### 2.1 Project Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Name | String | Yes | Project name |
| Slug | String | Auto | URL identifier |
| Description | Markdown | No | Rich text description |
| Icon | Emoji/String | No | Project icon |
| Color | Hex | No | Project color |
| Status | Enum | Yes | Planned, In Progress, Paused, Completed, Canceled |
| Priority | Enum | Yes | Urgent, High, Medium, Low, None |
| Lead | User | No | Project owner |
| Start Date | Date | No | When work begins |
| Target Date | Date | No | Expected completion |
| GitHub Repo | String | No | Connected repository |

### 2.2 Project Views

| View | Description |
|------|-------------|
| Overview | Description, progress, milestones, recent activity |
| Issues | All issues in project (list or kanban) |
| Milestones | Timeline of milestones |
| Resources | Boards and notes |
| Settings | Project configuration |

### 2.3 Project Status Workflow

```
Planned → In Progress → Completed
              ↓
           Paused
              ↓
          Canceled
```

---

## 3. Issue Management

### 3.1 Issue Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| Title | String | Yes | - | Issue title |
| Description | Rich Text | No | - | Detailed description |
| Status | Enum | Yes | Backlog | Current state |
| Priority | Enum | Yes | None | Urgency level |
| Project | Reference | No | - | Parent project |
| Milestone | Reference | No | - | Associated milestone |
| Assignee | User/AI | No | - | Who's working on it |
| Labels | Array | No | [] | Categorization tags |
| Due Date | Date | No | - | Deadline |
| Estimate | Number | No | - | Story points |
| Parent | Reference | No | - | For sub-issues |

### 3.2 Issue Identifier

Format: `{PREFIX}-{NUMBER}`

Examples:
- `MIL-1`, `MIL-2`, `MIL-123`
- Prefix from workspace settings (default: first 3 letters of workspace name)
- Number auto-increments per workspace

### 3.3 Status Workflow

| Category | Statuses | Description |
|----------|----------|-------------|
| Backlog | `backlog`, `triage` | Not yet prioritized |
| Active | `todo`, `in_progress`, `in_review` | Currently being worked on |
| Completed | `done`, `canceled`, `duplicate` | Work finished |

### 3.4 Priority Levels

| Priority | Icon | Color | Description |
|----------|------|-------|-------------|
| Urgent | 🔴 | Red | Needs immediate attention |
| High | 🟠 | Orange | Should be done soon |
| Medium | 🟡 | Yellow | Normal priority |
| Low | 🔵 | Blue | Can wait |
| None | ⚪ | Gray | Not prioritized |

### 3.5 Labels

| Property | Description |
|----------|-------------|
| Name | Label text |
| Color | Hex color code |
| Description | Optional explanation |

Default labels:
- Bug (Red)
- Feature (Purple)
- Improvement (Blue)

### 3.6 Issue Relations

| Type | Description |
|------|-------------|
| Blocks | This issue blocks another |
| Blocked by | This issue is blocked by another |
| Related | General relationship |
| Duplicate of | This is a duplicate of another |

### 3.7 Sub-Issues

- Any issue can have child issues
- Parent shows aggregate progress
- Children inherit project/milestone unless overridden

---

## 4. Issue Views

### 4.1 List View

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Filter] [Sort] [Group by]                              [View options] │
├────────────────────────────────────────────────────────────────────────┤
│ ☐ MIL-1  Fix authentication bug       🔴 Urgent   @john   In Progress │
│ ☐ MIL-2  Add dark mode toggle         🟡 Medium   @ai     Todo        │
│ ☐ MIL-3  Update documentation         🔵 Low      -       Backlog     │
└────────────────────────────────────────────────────────────────────────┘
```

**Features**:
- Bulk selection
- Inline status change
- Inline assignee change
- Drag to reorder
- Keyboard navigation

### 4.2 Kanban View

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│    Backlog   │     Todo     │ In Progress  │     Done     │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │
│ │ MIL-3    │ │ │ MIL-2    │ │ │ MIL-1    │ │ │ MIL-4    │ │
│ │ Update   │ │ │ Add dark │ │ │ Fix auth │ │ │ Refactor │ │
│ │ docs     │ │ │ mode     │ │ │ bug      │ │ │ API      │ │
│ └──────────┘ │ └──────────┘ │ └──────────┘ │ └──────────┘ │
│              │              │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Features**:
- Drag between columns (status change)
- Drag within column (reorder)
- Card preview on hover
- Quick actions

### 4.3 My Issues

Shows issues assigned to current user:
- Active issues (in progress, in review)
- Upcoming issues (todo)
- Backlog (assigned but not started)

### 4.4 All Issues

Shows all issues in workspace with filters:
- By status
- By project
- By assignee
- By label
- By priority
- Created/updated date range

---

## 5. Milestones

### 5.1 Milestone Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Name | String | Yes | Milestone name |
| Description | Markdown | No | Details |
| Target Date | Date | No | Deadline |
| Project | Reference | Yes | Parent project |

### 5.2 Milestone View

```
┌─────────────────────────────────────────────────────────────┐
│ v1.0 Release                                    Due: Feb 15 │
├─────────────────────────────────────────────────────────────┤
│ Progress: ████████░░░░░░░░ 45% (9/20 issues)               │
│                                                             │
│ Issues:                                                     │
│ ☑ MIL-4  Refactor API             Done                      │
│ ☑ MIL-5  Add tests                Done                      │
│ ☐ MIL-1  Fix auth bug             In Progress               │
│ ☐ MIL-2  Dark mode                Todo                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Activity & Comments

### 6.1 Issue Activity Log

| Event | Display |
|-------|---------|
| Created | "John created this issue" |
| Status change | "Jane changed status from Todo to In Progress" |
| Assignee change | "AI Claude was assigned" |
| Label added | "Added label Bug" |
| Comment added | "Alex commented" |
| Priority change | "Priority changed to Urgent" |

### 6.2 Comments

- Markdown support
- Threaded replies
- Mentions (@username)
- Reactions (future)
- Edit/delete own comments

---

## 7. Navigation & UI

### 7.1 Sidebar

```
┌────────────────────┐
│ 🏠 Workspace Name  │
├────────────────────┤
│ 📥 Inbox       (3) │
│ ⭐ Favorites       │
│ 📋 My Issues       │
├────────────────────┤
│ All Issues         │
│ Active             │
│ Backlog            │
├────────────────────┤
│ Projects           │
│  └ Project A       │
│  └ Project B       │
├────────────────────┤
│ AI Team            │
│  └ Claude          │
│  └ Codex           │
├────────────────────┤
│ ⚙️ Settings        │
└────────────────────┘
```

### 7.2 Command Palette (Cmd+K)

```
┌─────────────────────────────────────────┐
│ > Search issues, projects, commands...  │
├─────────────────────────────────────────┤
│ Recent                                   │
│  MIL-1  Fix authentication bug          │
│  Project A                              │
├─────────────────────────────────────────┤
│ Actions                                  │
│  Create new issue                       │
│  Create new project                     │
│  Go to settings                         │
└─────────────────────────────────────────┘
```

**Keyboard shortcuts**:
- `c` - Create issue
- `p` - Go to projects
- `i` - Go to inbox
- `/` - Focus search
- `?` - Show shortcuts

### 7.3 Issue Detail View

```
┌──────────────────────────────────────────────────────────────────────────┐
│ MIL-1                                                           [Close] │
│ Fix authentication bug                                                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                          │ Status:     [In Progress ▼]   │
│ ## Description                          │ Priority:   [🔴 Urgent ▼]      │
│                                          │ Assignee:   [@john ▼]         │
│ Users are unable to log in when...      │ Labels:     [Bug]             │
│                                          │ Project:    [Project A]       │
│ ### Steps to reproduce                  │ Milestone:  [v1.0]            │
│ 1. Go to login page                     │ Due:        [Feb 15]          │
│ 2. Enter credentials                    │ Estimate:   [3 points]        │
│ 3. Click submit                         │                               │
│                                          │ Relations:                    │
│                                          │  Blocks: MIL-5                │
├──────────────────────────────────────────┼───────────────────────────────┤
│ Activity                                 │ Sub-issues (2/3 done)         │
│ ─────────                               │ ☑ MIL-1a  Investigate         │
│ 2h ago  John added comment              │ ☑ MIL-1b  Write fix          │
│ 3h ago  Status → In Progress            │ ☐ MIL-1c  Add tests          │
│ 1d ago  Assigned to John                │                               │
│ 1d ago  Jane created this issue         │                               │
├──────────────────────────────────────────┴───────────────────────────────┤
│ Add comment...                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Inbox & Notifications

### 8.1 Notification Types

| Type | Trigger |
|------|---------|
| Assigned | Issue assigned to you |
| Mentioned | @mentioned in comment |
| Status changed | Subscribed issue status changed |
| Comment | New comment on subscribed issue |
| AI completed | AI teammate finished task |

### 8.2 Inbox UI

```
┌─────────────────────────────────────────────────────────────┐
│ Inbox                                    [Mark all read]    │
├─────────────────────────────────────────────────────────────┤
│ ● 2h ago  Claude completed MIL-7                            │
│           "Authentication refactor complete. PR created."  │
│                                                             │
│ ● 3h ago  John mentioned you in MIL-1                       │
│           "@alex can you review this?"                     │
│                                                             │
│ ○ 1d ago  Status changed: MIL-5 → Done                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. AI Teammate Integration

### 9.1 AI Teammate Setup

```
┌─────────────────────────────────────────────────────────────┐
│ AI Team                                        [+ Add AI]   │
├─────────────────────────────────────────────────────────────┤
│ 🤖 Claude (Claude-3 Opus)                                   │
│    Status: Active | Last used: 2h ago                       │
│    [Configure] [Disable]                                    │
│                                                             │
│ 🤖 Codex (GPT-4)                                            │
│    Status: Active | Last used: 1d ago                       │
│    [Configure] [Disable]                                    │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 AI Configuration

| Field | Description |
|-------|-------------|
| Name | Display name for the AI |
| Type | Claude, Codex, Custom |
| API Key | Encrypted storage |
| Model | Specific model version |
| Max Tokens | Token limit per request |
| System Prompt | Custom instructions |

### 9.3 Daytona Configuration

| Field | Description |
|-------|-------------|
| API Key | Daytona API key |
| Template | Sandbox template ID |
| Resources | CPU, memory limits |
| Timeout | Max execution time |

### 9.4 Assign to AI Flow

```
User assigns issue to AI → System checks:
  1. Does issue have description/requirements?
     - No → Prompt user to add context
     - Yes → Continue
  2. Create Daytona sandbox
  3. Initialize Claude Agent session
  4. Begin execution
  5. Stream updates to issue activity
  6. On completion:
     - Attach deliverables (PR link, files)
     - Update issue status
     - Notify user
```

### 9.5 AI Task Session View

```
┌─────────────────────────────────────────────────────────────┐
│ 🤖 AI Session: MIL-7                           [Stop Task]  │
├─────────────────────────────────────────────────────────────┤
│ Status: Running (12 min)                                    │
│ Agent: Claude                                               │
│ Sandbox: daytona-abc123                                     │
├─────────────────────────────────────────────────────────────┤
│ Live Log:                                                   │
│ 12:34:01  Reading codebase structure...                     │
│ 12:34:15  Found 3 relevant files                            │
│ 12:34:22  Implementing authentication fix...                │
│ 12:35:10  Running tests...                                  │
│ 12:35:45  All tests passing                                 │
│ 12:36:02  Creating pull request...                          │
├─────────────────────────────────────────────────────────────┤
│ Deliverables:                                               │
│ 📎 PR #42: Fix authentication flow                          │
│ 📄 auth.ts (modified)                                       │
│ 📄 auth.test.ts (added)                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Resources (Boards & Notes)

### 10.1 Board (Excalidraw)

Whiteboards within project context:

| Feature | Description |
|---------|-------------|
| Real-time sync | Via excalidraw-room |
| Project scoping | Boards belong to projects |
| Standalone | Or independent of projects |
| Link to issues | Reference boards in issues |

### 10.2 Note (BlockNote)

Documents within project context:

| Feature | Description |
|---------|-------------|
| Block-based | BlockNote editor |
| Project scoping | Notes belong to projects |
| Standalone | Or independent of projects |
| Link to issues | Reference notes in issues |

### 10.3 Resource Gallery

```
┌─────────────────────────────────────────────────────────────┐
│ Project A / Resources                       [+ Board] [+ Note] │
├─────────────────────────────────────────────────────────────┤
│ Boards                                                       │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│ │ Architecture│ │ User Flow   │ │ Wireframes  │             │
│ │ [thumbnail] │ │ [thumbnail] │ │ [thumbnail] │             │
│ └─────────────┘ └─────────────┘ └─────────────┘             │
│                                                              │
│ Notes                                                        │
│ ┌─────────────┐ ┌─────────────┐                             │
│ │ 📝 PRD      │ │ 📝 Meeting  │                             │
│ │             │ │   Notes     │                             │
│ └─────────────┘ └─────────────┘                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. GitHub Integration

### 11.1 Setup

1. Install GitHub App on organization
2. Select repositories to connect
3. Link repository to project

### 11.2 Features

| Feature | Description |
|---------|-------------|
| Branch names | Auto-generate from issue (e.g., `john/mil-1-fix-auth`) |
| PR linking | Detect issue identifier in PR title/description |
| Status sync | PR merged → Issue marked done |
| Commit references | Link commits mentioning issue |

### 11.3 Branch Name Format

```
{username}/{issue-identifier}-{title-slug}
```

Example: `john/mil-1-fix-authentication-bug`

---

## 12. Favorites

### 12.1 Favoriteable Items

- Projects
- Issues
- Boards
- Notes

### 12.2 UI

Quick access in sidebar under "Favorites" section.

---

## 13. Search

### 13.1 Global Search

- Issues (title, description, identifier)
- Projects (name, description)
- Boards (name)
- Notes (title, content)
- Users (name, email)

### 13.2 Filters

| Filter | Values |
|--------|--------|
| Type | Issue, Project, Board, Note |
| Status | Any status |
| Assignee | Any user or AI |
| Project | Any project |
| Created | Date range |
| Updated | Date range |

---

## 14. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` | Open command palette |
| `c` | Create new issue |
| `Cmd+Enter` | Submit form |
| `Esc` | Close modal/panel |
| `j/k` | Navigate list (down/up) |
| `Enter` | Open selected item |
| `l` | Open labels picker |
| `a` | Open assignee picker |
| `p` | Set priority |
| `m` | Move to project |
| `?` | Show all shortcuts |

---

## 15. Performance Requirements

| Metric | Target |
|--------|--------|
| Issue list render | < 100ms for 1000 issues |
| Kanban drag | 60fps |
| Search results | < 200ms |
| Issue creation | < 500ms |
| Page navigation | < 300ms |

---

*Document Version: 2.0.0 | January 20, 2026*
