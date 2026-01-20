# Milhouse System Design

## System Architecture Overview

Milhouse is structured as a layered architecture with four primary layers: User Interface, Orchestration, Subprocess Bridge, and Infrastructure.

The User Interface layer is built with Ink and React, providing a terminal-based reactive UI. This layer contains mode-specific components for Setup, Plan, Run, Review, Status, and General modes. Each mode component manages its own state and renders appropriate UI elements based on the current phase of operation.

The Orchestration layer contains the core business logic. It includes the Session Manager for lifecycle management, Template Engine using Handlebars for prompt and PRD generation, and Config Manager for TOML configuration generation. This layer coordinates between user input and subprocess execution.

The Subprocess Bridge layer manages communication with external tools. It includes dedicated bridges for Claude Code, Ralph TUI, and Agent Browser. Each bridge handles spawning, monitoring, and parsing output from its respective tool.

The Infrastructure layer provides foundational services including TMUX session management, Git worktree operations, filesystem access, and network communication for GitHub API integration.

## Component Breakdown

### CLI Entry Point

The entry point parses command-line arguments using Pastel for command routing and Ink for rendering. It determines the operating mode from the command and initializes the appropriate mode component. Commands include plan, run, review, status, and the default general mode for direct prompts.

```typescript
interface CLIArgs {
  command: 'plan' | 'run' | 'review' | 'status' | 'general';
  sessionName?: string;
  verbose?: boolean;
  prNumber?: number;
  preset?: 'quick' | 'standard' | 'complete';
}
```

### Session Manager

The Session Manager handles creation, persistence, loading, and state transitions for all sessions. Each session represents a complete workflow instance with its own configuration, PRD, and progress tracking.

```typescript
interface Session {
  id: string;
  name: string;
  status: SessionStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  lastActivityAt: Date;
  config: SessionConfig;
  paths: SessionPaths;
  progress: SessionProgress;
  git: GitInfo;
}

interface SessionConfig {
  tracker: 'json' | 'beads';
  maxIterations: number;
  trustLevel: 'conservative' | 'balanced' | 'generous';
  model: string;
  qualityGates: string[];
}

interface SessionPaths {
  session: string;
  worktree: string;
  prdMarkdown: string;
  prdJson: string;
  template: string;
  progressLog: string;
  auditLog: string;
}

interface SessionProgress {
  totalStories: number;
  completedStories: number;
  currentIteration: number;
  currentStory?: string;
  errors: SessionError[];
}

type SessionStatus =
  | 'created'
  | 'planned'
  | 'ready'
  | 'running'
  | 'paused'
  | 'detached'
  | 'completed';
```

### Claude Bridge

The Claude Bridge spawns Claude Code as a subprocess and processes JSONL streaming output. It handles authentication verification, retry logic for rate limits, and event parsing.

```typescript
interface ClaudeOptions {
  prompt: string;
  systemPrompt?: string;
  outputFormat: 'json' | 'text';
  model?: string;
  maxTurns?: number;
  allowedTools?: string[];
  cwd?: string;
}

interface ClaudeEvent {
  type: 'system' | 'assistant' | 'tool_use' | 'tool_result' | 'error';
  subtype?: string;
  message?: ClaudeMessage;
  tool?: string;
  input?: Record<string, unknown>;
  output?: unknown;
}

interface ClaudeMessage {
  content: string;
  role: 'assistant' | 'user';
}
```

The bridge spawns Claude Code using the command pattern:

```
claude -p "<prompt>" --output-format json [--system-prompt "<system>"] [--model <model>] [--max-turns <n>]
```

Output is parsed line by line as JSONL. The bridge emits parsed events through an async generator, allowing consumers to process events as they arrive.

### Ralph Bridge

The Ralph Bridge manages Ralph TUI execution within TMUX sessions. It generates configuration files, launches Ralph TUI, and monitors progress through file watching and TMUX output capture.

```typescript
interface RalphConfig {
  tracker: 'json' | 'beads';
  agent: 'claude';
  maxIterations: number;
  prompt_template: string;
  trackerOptions: {
    path: string;
  };
  agentOptions: {
    model: string;
    allowedTools: string[];
  };
  packageManager: {
    detected: PackageManager;
    runCommand: string;
  };
  qualityGates: {
    commands: string[];
    failFast: boolean;
  };
  errorHandling: {
    strategy: 'retry' | 'skip' | 'abort';
    maxRetries: number;
    retryDelayMs: number;
  };
}

type PackageManager = 'bun' | 'npm' | 'yarn' | 'pnpm';
```

### Agent Browser Bridge

The Agent Browser Bridge provides E2E testing capabilities within autonomous loops. It handles skill file installation in the Claude skills directory and generates test scripts from scenarios.

```typescript
interface E2ETestScenario {
  name: string;
  description: string;
  steps: E2EStep[];
}

interface E2EStep {
  action: 'navigate' | 'click' | 'fill' | 'wait' | 'assert';
  target?: string;
  value?: string;
  timeout?: number;
}
```

### TMUX Controller

The TMUX Controller manages detached terminal sessions for background execution. It handles session creation with unique naming, output logging via pipe-pane, liveness detection, and cleanup of orphaned sessions.

```typescript
interface SessionInfo {
  name: string;
  fullName: string;
  createdAt: Date;
  isAttached: boolean;
}
```

Session names follow the pattern `milhouse-{session-name}` to avoid collisions with user TMUX sessions.

### Worktree Manager

The Worktree Manager provides git worktree operations for branch isolation. Each session operates in its own worktree, protecting the main branch from autonomous changes.

```typescript
interface WorktreeInfo {
  path: string;
  branch: string;
  baseRef: string;
  createdAt: Date;
}
```

Worktrees are created in the `./worktrees/{session-name}/` directory with branches named `milhouse/{session-name}`.

### Template Engine

The Template Engine uses Handlebars to generate prompt templates and PRD documents. It provides helpers for common formatting tasks and injects session context into templates.

```typescript
interface TemplateContext {
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  acceptanceCriteria: string;
  dependsOn?: string[];
  config: {
    packageManager: {
      detected: string;
      runCommand: string;
    };
  };
  qualityGates: {
    commands: string[];
  };
  recentProgress?: string;
}
```

### PRD Converter

The PRD Converter transforms markdown PRDs into Ralph TUI compatible JSON format. It parses YAML frontmatter, extracts user stories, and generates the task structure Ralph expects.

```typescript
interface MarkdownPRD {
  frontmatter: PRDFrontmatter;
  overview: string;
  goals: string[];
  stories: UserStory[];
}

interface PRDFrontmatter {
  name: string;
  version: number;
  tracker: 'json' | 'beads';
  maxIterations: number;
  qualityGates: string[];
}

interface UserStory {
  id: string;
  title: string;
  type: 'feature' | 'task' | 'bug';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedIterations: number;
  context: string;
  acceptanceCriteria: string[];
  filesToModify: string[];
  dependencies: string[];
}

interface RalphJSONPRD {
  name: string;
  tasks: RalphTask[];
}

interface RalphTask {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  status: 'open' | 'in_progress' | 'closed';
  priority: number;
  dependsOn: string[];
  labels: string[];
}
```

### Interview Engine

The Interview Engine generates contextual questions based on the user request and codebase analysis. It manages question flow, handles follow-up question generation, and collects answers.

```typescript
interface InterviewConfig {
  intensity: 'chill' | 'thorough' | 'comprehensive';
  screamInput: string;
  resources: ResourceSet;
  codebaseAnalysis: CodebaseAnalysis;
}

interface InterviewQuestion {
  id: string;
  question: string;
  type: 'text' | 'choice' | 'multiselect';
  options?: string[];
  context?: string;
  category: 'scope' | 'behavior' | 'edge_case' | 'technical' | 'ux';
}

interface ResourceSet {
  files: string[];
  urls: string[];
  docs: string[];
}

interface CodebaseAnalysis {
  relevantFiles: string[];
  patterns: string[];
  technologies: string[];
  existingTests: string[];
}
```

### Progress Monitor

The Progress Monitor watches Ralph TUI execution and extracts status information. It uses file system watchers on progress.md and polls TMUX output for real-time updates.

```typescript
interface ProgressEvent {
  type: 'iteration_start' | 'iteration_end' | 'task_start' | 'task_complete' | 'error' | 'quality_gate';
  timestamp: Date;
  data: Record<string, unknown>;
}

interface Iteration {
  number: number;
  storyId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed' | 'skipped';
  toolsUsed: string[];
  filesModified: string[];
  qualityGateResults: QualityGateResult[];
  completionSignal?: 'COMPLETE' | 'BLOCKED' | 'EJECT';
  errorMessage?: string;
}

interface QualityGateResult {
  command: string;
  passed: boolean;
  output: string;
  duration: number;
}
```

### Audit Logger

The Audit Logger records all significant operations for debugging and compliance. It supports console output in verbose mode and persists structured logs to session directories.

```typescript
interface AuditLogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  component: string;
  action: string;
  message: string;
  correlationId: string;
  sessionId?: string;
  data?: Record<string, unknown>;
  duration?: number;
}

interface AuditLoggerOptions {
  verbose: boolean;
  logPath: string;
  component: string;
  correlationId: string;
}
```

## Data Flow

### Plan Mode Data Flow

The user invokes plan mode and enters the scream phase where they describe the desired feature in natural language. The system captures this input along with any referenced files or URLs.

The system then invokes Claude Code to analyze the codebase, passing the user description as context. Claude uses Glob, Grep, and Read tools to identify relevant files, patterns, and technologies. The analysis results return to Milhouse for user confirmation.

Next, the system presents the resources phase where users can add or remove files from the analysis and select interview intensity. The system then invokes Claude Code again to generate interview questions based on the description, analysis, and intensity level.

The interview phase presents questions one at a time, collecting answers. For choice questions, users select from options or provide custom input. Answers are stored in a map keyed by question ID.

With all context gathered, the system invokes Claude Code to generate the PRD. The prompt includes the original description, codebase analysis, resource references, and all interview answers. Claude generates markdown following the PRD template format.

The user reviews the generated PRD with options to approve, edit, or restart. Upon approval, the system executes auto-configuration: converting the markdown PRD to JSON, generating config.toml and the Handlebars template, creating the git worktree, and persisting the session state.

### Run Mode Data Flow

The user invokes run mode with a session name. The system loads the session from the filesystem and verifies its status is ready.

Pre-flight checks verify Claude authentication, worktree existence, and TMUX availability. Any failures display actionable error messages.

The system creates a TMUX session with a unique name and configures output logging via pipe-pane. It then sends the Ralph TUI launch command to the TMUX session.

Ralph TUI executes autonomously, reading tasks from the JSON PRD, building prompts from the template, invoking Claude Code, and running quality gates. Milhouse monitors through file watching and TMUX output capture.

The UI displays real-time progress including current iteration, story being worked, and quality gate results. Users can detach to let the loop run in background, pause after the current iteration, or abort immediately.

When Ralph TUI completes or reaches max iterations, the system captures final state, updates the session status, and presents completion options including creating a pull request or viewing the diff.

### Review Mode Data Flow

The user invokes review mode with a pull request number. The system fetches PR metadata, diff, and existing comments using GitHub CLI.

The system invokes Claude Code to analyze the PR changes for security vulnerabilities, bugs, performance issues, and style violations. Findings are categorized by severity and type.

For fixable issues, the system generates a temporary fix PRD with each finding converted to a user story. It then launches a Ralph TUI loop to implement fixes, operating within the same worktree.

After fixes complete, the system generates test stories for affected code and launches another Ralph TUI loop for test generation. If E2E testing is applicable, it generates Agent Browser test scripts and executes them.

Finally, the system generates a comprehensive review report summarizing findings, fixes applied, tests added, and any remaining issues requiring manual review. The report can be posted as a PR comment.

## Integration Points

### Claude Code Integration

Milhouse communicates with Claude Code through subprocess spawning. The primary interface uses the `-p` flag for prompts and `--output-format json` for JSONL streaming output.

Authentication status is verified by running a minimal command and checking for auth errors in the response. If authentication fails, the system guides users to run `claude /login`.

Rate limit handling uses exponential backoff with three retry attempts. Auth expiry during long sessions triggers re-authentication prompts.

### Ralph TUI Integration

Milhouse generates all Ralph TUI configuration automatically. The config.toml file specifies the tracker type, agent settings, quality gates, and error handling strategy.

Ralph TUI reads the JSON PRD from the path specified in trackerOptions.path. The prompt template is loaded from the templates directory, with the filename matching the tracker type.

Quality gate commands are injected into the configuration with package manager detection ensuring correct run commands across npm, yarn, pnpm, and bun.

### Agent Browser Integration

Milhouse installs a Claude skill file that provides Agent Browser CLI documentation. This skill is placed in `.claude/skills/agent-browser/SKILL.md` within the project.

When E2E testing is needed, the system generates bash scripts using Agent Browser commands. Scripts use session isolation to prevent interference between concurrent tests.

The Agent Browser workflow follows: navigate to URL, capture snapshot with interactive elements, perform interactions using element refs, and verify expected outcomes.

## Configuration Schemas

### config.toml Schema

```toml
# Core settings
tracker = "json"
agent = "claude"
maxIterations = 25
prompt_template = "./templates/json.hbs"

[trackerOptions]
path = "../../prd.json"

[agentOptions]
model = "sonnet"
allowedTools = ["Read", "Edit", "Write", "Bash", "Glob", "Grep", "TodoWrite"]

[packageManager]
detected = "bun"
runCommand = "bun run"

[qualityGates]
commands = ["bun run typecheck", "bun run test", "bun run lint"]
failFast = true

[errorHandling]
strategy = "retry"
maxRetries = 3
retryDelayMs = 5000

[rateLimitHandling]
enabled = true
maxRetries = 3
baseBackoffMs = 5000
recoverPrimaryBetweenIterations = true
```

### template.hbs Schema

The Handlebars template receives a context object with task information, configuration, and progress data. Required sections include task context, package manager instructions, acceptance criteria, quality gates, protocol instructions, and completion signals.

```handlebars
## Task: {{taskTitle}}

### Context
{{taskDescription}}

### Package Manager
This project uses {{config.packageManager.detected}}.
Run scripts with: {{config.packageManager.runCommand}} <script>

{{#if dependsOn}}
### Prerequisites Completed
{{dependsOn}}
{{/if}}

### Acceptance Criteria
{{acceptanceCriteria}}

### Quality Gates
{{#each ../qualityGates.commands}}
- {{this}}
{{/each}}

### Protocol
1. Read relevant files before coding
2. Implement only what is needed for this story
3. Write tests alongside implementation
4. Run quality gates after changes
5. Fix failures before proceeding

{{#if recentProgress}}
### Previous Progress
{{recentProgress}}
{{/if}}

### Completion Signal
When all acceptance criteria are met and quality gates pass:
<promise>COMPLETE</promise>

If blocked:
<promise>BLOCKED: description</promise>
```

### session.json Schema

```typescript
interface SessionFile {
  id: string;
  name: string;
  status: SessionStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  lastActivityAt: string;
  config: {
    tracker: string;
    maxIterations: number;
    trustLevel: string;
    model: string;
    qualityGates: string[];
  };
  paths: {
    session: string;
    worktree: string;
    prdMarkdown: string;
    prdJson: string;
    template: string;
    progressLog: string;
    auditLog: string;
  };
  progress: {
    totalStories: number;
    completedStories: number;
    currentIteration: number;
    currentStory?: string;
    errors: Array<{
      timestamp: string;
      type: string;
      message: string;
      story?: string;
      recoverable: boolean;
    }>;
  };
  git: {
    baseBranch: string;
    workBranch: string;
    baseCommit: string;
  };
}
```

## Error Handling Strategy

### Error Taxonomy

Errors are organized into a hierarchy with specific handling strategies:

**SetupError** covers dependency and environment issues. DependencyMissingError indicates required tools are not installed. DependencyVersionError indicates incompatible versions. AuthenticationError indicates Claude is not logged in. PlatformUnsupportedError indicates unsupported operating systems.

**SessionError** covers session lifecycle issues. SessionExistsError indicates duplicate session names. SessionNotFoundError indicates missing sessions. SessionCorruptedError indicates invalid state files. WorktreeConflictError indicates git worktree issues.

**ExecutionError** covers runtime failures. RalphCrashError indicates Ralph TUI process death. ClaudeTimeoutError indicates Claude response timeouts. ClaudeRateLimitError indicates API rate limiting. QualityGateFailedError indicates test or lint failures. MaxIterationsReachedError indicates loop limits.

**PlanError** covers PRD generation issues. InterviewAbortedError indicates user cancellation. PRDGenerationError indicates Claude generation failures. PRDValidationError indicates invalid PRD structure.

**ReviewError** covers review mode issues. PRNotFoundError indicates missing pull requests. PRAccessDeniedError indicates permission issues. AnalysisFailedError indicates analysis failures.

### Error Base Class

```typescript
class MilhouseError extends Error {
  constructor(
    message: string,
    public suggestion: string,
    public code?: string,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'MilhouseError';
  }
}
```

### Recovery Strategies

Authentication expiry triggers re-authentication prompts without losing session state. Rate limits trigger exponential backoff with configurable retry counts. Quality gate failures retry the current iteration up to three times before marking as blocked. Network failures retry with backoff. TMUX session death offers restart options.

## State Machine Definitions

### Session State Machine

Sessions transition through states based on user actions and system events.

The CREATED state is the initial state after session creation. Transitions to PLANNED when PRD generation completes.

The PLANNED state indicates PRD exists but configuration is not complete. Transitions to READY when auto-configuration completes.

The READY state indicates the session is fully configured and ready to execute. Transitions to RUNNING when execution starts.

The RUNNING state indicates Ralph TUI is actively executing. Transitions to PAUSED on user pause, DETACHED on user detach, or COMPLETED when execution finishes.

The PAUSED state indicates execution stopped after current iteration. Transitions to RUNNING on resume or READY on reset.

The DETACHED state indicates execution continues in background. Transitions to RUNNING on reattach or COMPLETED when execution finishes.

The COMPLETED state is the terminal state. Includes substates for SUCCESS when all stories completed, PARTIAL when some stories completed, and FAILED when no stories completed.

## File and Folder Structure

### Project Structure

```
milhouse/
├── src/
│   ├── cli/
│   │   ├── index.ts              # Entry point
│   │   ├── commands/             # Command handlers
│   │   │   ├── plan.ts
│   │   │   ├── run.ts
│   │   │   ├── review.ts
│   │   │   └── status.ts
│   │   └── ui/                   # Ink components
│   │       ├── components/
│   │       │   ├── Header.tsx
│   │       │   ├── Progress.tsx
│   │       │   ├── Interview.tsx
│   │       │   └── Completion.tsx
│   │       └── screens/
│   │           ├── PlanScreen.tsx
│   │           ├── RunScreen.tsx
│   │           └── ReviewScreen.tsx
│   ├── core/
│   │   ├── session/
│   │   │   ├── manager.ts
│   │   │   ├── types.ts
│   │   │   └── state-machine.ts
│   │   ├── plan/
│   │   │   ├── interview.ts
│   │   │   ├── analyzer.ts
│   │   │   └── generator.ts
│   │   ├── prd/
│   │   │   ├── converter.ts
│   │   │   ├── parser.ts
│   │   │   └── validator.ts
│   │   ├── ralf/
│   │   │   ├── config-generator.ts
│   │   │   ├── template-engine.ts
│   │   │   ├── monitor.ts
│   │   │   └── quality-gates.ts
│   │   ├── claude/
│   │   │   ├── subprocess.ts
│   │   │   ├── event-parser.ts
│   │   │   └── auth.ts
│   │   └── browser/
│   │       ├── skill-installer.ts
│   │       └── e2e-generator.ts
│   ├── infrastructure/
│   │   ├── tmux.ts
│   │   ├── worktree.ts
│   │   ├── setup.ts
│   │   └── github.ts
│   └── utils/
│       ├── errors.ts
│       ├── logger.ts
│       ├── audit.ts
│       └── fs.ts
├── tests/
│   ├── unit/
│   │   ├── prd/
│   │   ├── session/
│   │   └── utils/
│   ├── integration/
│   │   ├── claude-bridge.test.ts
│   │   ├── ralph-bridge.test.ts
│   │   └── session-manager.test.ts
│   └── e2e/
│       ├── plan.test.ts
│       ├── run.test.ts
│       └── review.test.ts
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── CLI_REFERENCE.md
│   ├── DEVELOPMENT.md
│   ├── TESTING.md
│   └── CHANGELOG.md
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

### Session Directory Structure

```
.milhouse/
├── config.toml                   # Global Milhouse config (optional)
└── sessions/
    └── {session-name}/
        ├── session.json          # Session state
        ├── prd.md                # Human-readable PRD
        ├── prd.json              # Ralph-compatible JSON
        ├── audit.log             # Audit log (JSON lines)
        ├── tmux.log              # TMUX output capture
        ├── iterations/
        │   ├── 001.md
        │   ├── 002.md
        │   └── ...
        └── .ralph-tui/
            ├── config.toml
            ├── progress.md
            └── templates/
                └── json.hbs
```

### Worktree Structure

```
worktrees/
└── {session-name}/
    ├── .git                      # Worktree git link
    ├── .milhouse/                # Symlink to session directory
    └── {project files}
```

## Testing Infrastructure

### Unit Testing

Unit tests use Vitest and cover pure functions in isolation. Mock implementations are provided for filesystem, subprocess, and external APIs.

```typescript
describe('parseCliArgs', () => {
  it('parses plan mode correctly', () => {
    const args = parseCliArgs(['plan', 'build a login page']);
    expect(args.mode).toBe('plan');
    expect(args.scream).toBe('build a login page');
  });
});

describe('detectPackageManager', () => {
  it('detects bun from lockfile', async () => {
    const mockFs = createMockFs({ 'bun.lockb': '' });
    const pm = await detectPackageManager('/project', mockFs);
    expect(pm).toBe('bun');
  });
});
```

### Integration Testing

Integration tests verify component combinations with mocked external dependencies.

```typescript
describe('SessionManager', () => {
  it('creates session with correct structure', async () => {
    const mockFs = createMockFs();
    const manager = new SessionManager({ fs: mockFs });

    await manager.create('test-session', { scream: 'build X' });

    expect(mockFs.existsSync('.milhouse/sessions/test-session')).toBe(true);
    expect(mockFs.existsSync('.milhouse/sessions/test-session/session.json')).toBe(true);
  });
});
```

### End-to-End Testing

E2E tests invoke the actual CLI using execa. A test mode environment variable bypasses external API calls.

```typescript
describe('CLI E2E', () => {
  it('shows help', async () => {
    const { stdout } = await execa('milhouse', ['--help']);
    expect(stdout).toContain('Usage: milhouse');
    expect(stdout).toContain('plan');
    expect(stdout).toContain('run');
  });

  it('creates a session in plan mode', async () => {
    const { stdout } = await execa('milhouse', ['plan', 'test feature'], {
      env: { MILHOUSE_TEST_MODE: 'true' }
    });
    expect(stdout).toContain('Session created');
  });
});
```

## Audit Logging Implementation

### Log Format

Audit logs use JSON Lines format with one entry per line. Each entry includes timestamp, level, component, action, message, correlation ID, and optional data.

```json
{"timestamp":"2026-01-17T14:32:01.234Z","level":"info","component":"SessionManager","action":"create","message":"Creating session","correlationId":"abc123","sessionId":"session-1","data":{"name":"password-reset"}}
{"timestamp":"2026-01-17T14:32:02.456Z","level":"debug","component":"ClaudeBridge","action":"spawn","message":"Spawning Claude subprocess","correlationId":"abc123","data":{"args":["-p","..."],"maxTurns":10}}
```

### Verbose Mode

When the `--verbose` flag is provided, logs are output to the console in addition to the file. Console output includes color coding by level and formatted timestamps.

```
[14:32:01] [SessionManager] Creating session
           Data: { name: "password-reset", scream: "..." }

[14:32:02] [ClaudeBridge] Spawning Claude subprocess
           Data: { args: ["-p", "..."], maxTurns: 10 }
```

### Log Retention

Audit logs are stored per session in the session directory. The system does not automatically delete logs. Users can export logs for debugging or archive them as needed.

### Correlation IDs

Each user-initiated operation receives a unique correlation ID. All subsequent log entries for that operation include the same correlation ID, enabling trace reconstruction.

## Global Configuration

### Configuration Hierarchy

Configuration is resolved in order of precedence from highest to lowest: CLI flags, environment variables, project config at .milhouse/config.toml, global config at ~/.config/milhouse/config.toml, and built-in defaults.

### Global Config Schema

```toml
# ~/.config/milhouse/config.toml

[defaults]
model = "sonnet"
trustLevel = "balanced"
interviewIntensity = "thorough"
maxIterations = 25

[ui]
colorScheme = "auto"
verbose = false

[paths]
worktreeDir = "./worktrees"
sessionDir = ".milhouse/sessions"
```

### Project Config Schema

```toml
# .milhouse/config.toml

[project]
name = "my-project"
defaultBranch = "main"

[defaults]
model = "opus"
trustLevel = "balanced"
qualityGates = ["bun run typecheck", "bun run test", "bun run lint"]

[packageManager]
override = "bun"
```

## Resume and Checkpoint Mechanism

### Checkpoint Data

After each iteration completes, the system persists a checkpoint containing the iteration number, completed story IDs, current PRD state with task statuses, quality gate results, and timestamp.

```typescript
interface Checkpoint {
  iteration: number;
  completedStories: string[];
  prdState: RalphJSONPRD;
  lastQualityGates: QualityGateResult[];
  timestamp: string;
  recoveryPoint: 'iteration_complete' | 'mid_iteration';
}
```

### Resume Flow

When resume is invoked, the system loads the session and checkpoint, verifies worktree exists and is clean, restores PRD state from checkpoint, and restarts Ralph TUI from the last completed iteration.

## Pull Request Creation

### PR Generation Flow

Upon completion, the system collects the diff between base branch and work branch, generates PR title from PRD name or session name, generates PR body from PRD overview and completed stories list, pushes the work branch to remote, and creates the PR using GitHub CLI.

```typescript
interface PRCreationOptions {
  draft: boolean;
  title?: string;
  labels?: string[];
  assignees?: string[];
  reviewers?: string[];
}
```

### PR Body Template

The PR body includes a summary section with the PRD overview, a completed stories section listing all finished stories with their IDs, a changes section noting files modified count, and a footer indicating generation by Milhouse.

## Trust Level Implementation

### Tool Restrictions by Trust Level

Conservative trust level allows Read, Glob, Grep, and Edit tools only. This mode is suitable for sensitive codebases where Bash execution is not permitted.

Balanced trust level allows Read, Glob, Grep, Edit, Write, and Bash tools with command restrictions. Bash commands are logged and certain patterns like rm -rf are blocked.

Generous trust level allows all tools without restrictions. This mode is suitable for isolated development environments and testing.

```typescript
type TrustLevel = 'conservative' | 'balanced' | 'generous';

const TOOL_ALLOWLIST: Record<TrustLevel, string[]> = {
  conservative: ['Read', 'Glob', 'Grep', 'Edit'],
  balanced: ['Read', 'Glob', 'Grep', 'Edit', 'Write', 'Bash', 'TodoWrite'],
  generous: ['Read', 'Glob', 'Grep', 'Edit', 'Write', 'Bash', 'TodoWrite', 'Task', 'WebFetch'],
};
```

## Environment Variables

The system reads the following environment variables at startup:

```typescript
interface EnvironmentConfig {
  MILHOUSE_VERBOSE?: boolean;
  MILHOUSE_TEST_MODE?: boolean;
  MILHOUSE_CONFIG_PATH?: string;
  MILHOUSE_LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
  ANTHROPIC_API_KEY?: string;
}
```

Test mode disables all external API calls and uses mock responses. This enables E2E testing without Claude Code or GitHub dependencies.

## Keyboard Shortcut Mapping

```typescript
const SHORTCUTS: Record<Mode, Record<string, Action>> = {
  plan: {
    'enter': 'submit',
    'escape': 'back',
    'tab': 'nextField',
    'ctrl+c': 'abort',
  },
  run: {
    'd': 'detach',
    'p': 'pause',
    'q': 'abort',
    'r': 'refresh',
    'l': 'viewLog',
  },
  review: {
    'enter': 'confirm',
    'space': 'toggle',
    'a': 'approveAll',
    's': 'skipSelected',
    'escape': 'cancel',
  },
  status: {
    'enter': 'viewDetails',
    'd': 'delete',
    'a': 'attach',
    'c': 'cleanup',
  },
};
```
