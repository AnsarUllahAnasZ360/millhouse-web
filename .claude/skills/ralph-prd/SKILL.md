---
name: ralph-prd
description: Create self-verifying PRDs for autonomous Ralph loop execution
user-invocable: true
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - TodoWrite
  - AskUserQuestion
---

# Ralph PRD Skill

Create self-verifying PRDs for autonomous Ralph loop execution.

## Trigger Phrases
- "create a prd", "ralph prd", "plan a feature", "plan a release", "create prd for"

---

# Part 1: How to Design PRDs

This section teaches how to think about PRD creation. These are the principles and mental models to apply when analyzing a feature request.

---

## Core Philosophy

**Geoffrey Huntley's Ralph Methodology:**

1. **Deterministic Progress** - Every iteration moves measurably forward
2. **Self-Verification** - The model decides and runs appropriate tests
3. **Backpressure** - Just enough verification, not too much (not too little)
4. **Compound Learning** - Document learnings for future iterations
5. **Deliverability** - Whatever is delivered MUST work; tests MUST pass

---

## Step 0: Understand the Project

Before writing any PRD, read CLAUDE.md to understand:
- **Tech stack** - Languages, frameworks, libraries
- **File structure** - Where code lives, naming conventions
- **Testing setup** - Test commands, test file locations, test types
- **Build commands** - How to run, build, lint, typecheck
- **Development server** - How to start local development
- **Patterns** - Established conventions to follow

This context is essential for writing actionable stories.

---

## Step 1: Analyze the Request

Before writing any stories, understand what you're building:

### Context Gathering Questions

1. **What is the core problem?** - Not the solution, the problem being solved
2. **Who benefits and how?** - User impact, business value
3. **What exists already?** - Related code, patterns, prior art in codebase
4. **What are the risks?** - Breaking changes, edge cases, dependencies
5. **What's the scope boundary?** - What's in/out of this work

### Codebase Investigation

Read these before writing the PRD:
- Relevant files that will be modified
- Existing patterns to follow
- Test files that exist for related functionality
- CLAUDE.md for project conventions
- Any referenced specs or documentation

---

## Step 2: Design Phased Implementation

### Divide Work Into Phases

Every significant PRD should be divided into phases. Each phase:
- Has a clear, achievable goal
- Starts with context gathering
- Ends with a checkpoint verification
- Can stand alone if the loop is interrupted

### Phase Structure Template

```
Phase 1: Foundation
├── US-001: [Context Gathering] Understand scope and document approach
├── US-002: Core implementation
├── US-003: Tests for core
└── US-004: [Checkpoint] Phase 1 verification

Phase 2: Features
├── US-005: [Context Gathering] Review Phase 1 learnings
├── US-006: Feature implementation
├── US-007: Feature tests
└── US-008: [Checkpoint] Phase 2 verification

Phase 3: Final
├── US-009: Polish and edge cases
├── US-010: [Final Validation] Full test suite
└── US-011: [Report] Generate sprint report
```

### Consistent Phase Rituals

**Phase Start Ritual (Context Gathering Story):**
- Read key files mentioned in notes
- Review `.ralph-tui/progress.md` for prior learnings
- Document the approach in progress.md
- Identify specific files that will be modified
- Note patterns to follow and risks to avoid

**Phase End Ritual (Checkpoint Story):**
- Verify all phase stories are complete
- Run related tests (not full suite)
- Update progress.md with phase summary
- Document gotchas and patterns discovered
- Run typecheck and lint (see CLAUDE.md for commands)
- Commit all pending changes

---

## Step 3: Calibrate Backpressure

Backpressure = the amount of verification required for a story. Too little and bugs slip through. Too much and progress stalls.

### Backpressure Levels

| Level | When to Use | What It Includes |
|-------|-------------|------------------|
| **Minimal** | Type-only changes, documentation | Typecheck only |
| **Light** | Simple, low-risk changes | Typecheck + Lint |
| **Standard** | Most implementation stories | Typecheck + Lint + Related unit tests |
| **Heavy** | Complex logic, integrations | Standard + Integration tests |
| **Full** | Phase checkpoints, final validation | Full test suite (see CLAUDE.md) |

### Deciding Test Types Per Story

| Change Type | Recommended Tests |
|-------------|-------------------|
| Pure function/utility | Unit test |
| React hook / state logic | Hook/unit test |
| UI component | Component test |
| API route | Integration test |
| Database query | Integration test with test DB |
| User workflow | E2E test |
| Cross-system flow | E2E + visual verification |

### Default Baseline (Every Story)

Every implementation story should at minimum run:
- Typecheck (see CLAUDE.md for command)
- Lint (see CLAUDE.md for command)
- Related unit tests (see CLAUDE.md for test locations)

Only the final validation story runs the full test suite.

---

## Step 4: Write Effective Descriptions

### Description vs Tasks vs Acceptance Criteria

| Field | Purpose | Example |
|-------|---------|---------|
| **description** | WHAT the issue is and WHY it matters | "The lead import modal crashes when CSV has >1000 rows. This blocks users from bulk imports." |
| **tasks** | HOW to approach it - step-by-step instructions | "1. Read the csv-parser module\n2. Identify the memory issue\n3. Implement streaming parser" |
| **acceptanceCriteria** | VERIFICATION - how to confirm it's done | "CSV with 5000 rows imports successfully. No memory warnings in console." |

### Good Description Pattern

```
[WHAT is the problem/feature]
[WHY it matters - user/business impact]
[CONTEXT - what exists, what approach to take]
```

Example:
```
The sequence editor currently doesn't support manual step editing. Users have requested
the ability to modify individual touchpoints after AI generation. This requires adding
an edit mode to the existing sequence viewer component. Check CLAUDE.md for component
patterns and test file locations.
```

### Good Tasks Pattern

Tasks are implementation instructions. They should:
1. Start with exploration/reading
2. Have clear action items
3. Include verification steps
4. Reference CLAUDE.md for project-specific commands

Example:
```json
"tasks": [
  "Read the sequence viewer component to understand current structure",
  "Check existing edit patterns in similar components (search codebase)",
  "Add 'editMode' state and toggle button",
  "Implement inline editing for step title and body fields",
  "Add save/cancel handlers that call the existing update action",
  "Find related tests (see CLAUDE.md for test locations)",
  "Write tests for the new edit functionality",
  "Run tests (see CLAUDE.md for test command)",
  "If UI change: verify visually using dev server"
]
```

---

## Step 5: Include Verification Guidance

### Test Discovery Task

For any story that modifies existing code, include a task to find existing tests:

```json
"tasks": [
  "Find existing tests: check CLAUDE.md for test file locations, look near the files you're modifying",
  "Determine what new test cases are needed based on your changes",
  "Write tests BEFORE marking this story complete"
]
```

### Visual Verification for UI Changes

For any UI changes, include visual verification in tasks:

```json
"tasks": [
  "After implementation, verify visually:",
  "  Start the dev server (see CLAUDE.md for command)",
  "  Navigate to the relevant page",
  "  Confirm the UI renders correctly",
  "  Test the interaction manually"
]
```

If the project has browser automation tooling (e.g., agent-browser, Playwright), reference CLAUDE.md for the specific commands.

---

## Step 6: Structure the Notes Field

Notes provide WHERE, WHAT, HOW, and WARNINGS.

### Notes Template

```
Files to read: [specific paths with line numbers if relevant]
Patterns to follow: [reference files showing the pattern]
Test location: [where to find/create tests - or "see CLAUDE.md"]
Commands: [specific commands or "see CLAUDE.md for test commands"]
Warnings: [pitfalls, things NOT to do]
```

### Example Notes

```json
"notes": "Read the existing agent implementation for the tool pattern. Follow the tool definition style in the tools directory. Check CLAUDE.md for test file locations and test commands. Warning: Don't modify the singleton pattern in the main agent file."
```

---

# Part 2: PRD Structure Reference

This section documents the exact structure expected by the Ralph TUI prompt template.

---

## prd.json Structure

```json
{
  "name": "kebab-case-name",
  "description": "Project intro that appears at the top of every task prompt. Include motivation, goals, and reference to CLAUDE.md for project conventions.",
  "branchName": "type/feature-name",
  "userStories": [...]
}
```

---

## User Story Structure

```json
{
  "id": "US-001",
  "title": "Short descriptive title",
  "description": "WHAT the issue/feature is and WHY it matters. Context, not instructions.",
  "tasks": [
    "Step 1: Read [specific file] to understand current implementation",
    "Step 2: [Specific action to take]",
    "Step 3: Find tests (see CLAUDE.md for test locations)",
    "Step 4: Write tests for new functionality",
    "Step 5: Run tests (see CLAUDE.md for test command)",
    "Step 6: Verify visually if UI change"
  ],
  "acceptanceCriteria": [
    "Specific, verifiable criterion 1",
    "Specific, verifiable criterion 2",
    "Tests pass for this functionality"
  ],
  "dependsOn": ["US-000"],
  "notes": "WHERE to look, files to reference, patterns, warnings. Reference CLAUDE.md for commands.",
  "passes": false
}
```

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier (US-001, US-002, etc.) |
| `title` | Yes | Short, descriptive title (5-10 words) |
| `description` | Yes | Problem statement and context. What and Why, not How. |
| `tasks` | Yes | Ordered list of implementation steps. How to approach. |
| `acceptanceCriteria` | Yes | Verification criteria. How to confirm it's done. |
| `dependsOn` | No | Array of story IDs that must complete first |
| `notes` | No | File paths, patterns, warnings, CLAUDE.md references |
| `passes` | Yes | Set to `false`, Ralph marks `true` when complete |

---

## Template Variables

The prompt.hbs template uses these variables:

| Variable | Source | Purpose | How to Write It |
|----------|--------|---------|-----------------|
| `{{prdName}}` | prd.name | Project title shown at top | Use kebab-case, descriptive name |
| `{{prdDescription}}` | prd.description | Motivation and context for all tasks | 2-3 sentences: what project is, why this sprint matters, reference CLAUDE.md |
| `{{taskId}}` | story.id | Task identifier | Format: US-XXX |
| `{{taskTitle}}` | story.title | Task name displayed prominently | Action-oriented, 5-10 words |
| `{{taskDescription}}` | story.description | Full context for the task | Problem + Why + Context (NOT how-to) |
| `{{tasks}}` | story.tasks | Step-by-step implementation guide | Ordered list of specific actions |
| `{{acceptanceCriteria}}` | story.acceptanceCriteria | Verification checkpoints | Specific, testable criteria |
| `{{notes}}` | story.notes | Additional guidance | File paths, patterns, warnings |
| `{{dependsOn}}` | story.dependsOn | Prerequisites | Array of story IDs |
| `{{recentProgress}}` | .ralph-tui/progress.md | Context from previous iterations | Auto-populated by Ralph |

### Example: Filling Template Variables

```json
{
  "name": "v1.2.0-feature-name",
  "description": "You are building [Project Name] - [brief description]. This sprint adds [feature]. Reference CLAUDE.md for coding standards, testing commands, and project conventions.",
  "branchName": "feature/feature-name",
  "userStories": [
    {
      "id": "US-001",
      "title": "Understand Current Implementation and Document Approach",
      "description": "Before implementing, we need to understand the current architecture and how similar patterns work elsewhere in the codebase.",
      "tasks": [
        "Read CLAUDE.md for project structure and conventions",
        "Read the main component/module to understand current structure",
        "Check for similar patterns in the codebase",
        "Check for existing tests (see CLAUDE.md for test locations)",
        "Document findings in .ralph-tui/progress.md: architecture, patterns, approach",
        "List specific files that will need modification"
      ],
      "acceptanceCriteria": [
        "progress.md updated with architecture notes",
        "Implementation approach documented with specific file paths",
        "Existing patterns identified and noted"
      ],
      "dependsOn": [],
      "notes": "This is an exploration story. Focus on understanding, not implementing. Reference CLAUDE.md for test file locations.",
      "passes": false
    }
  ]
}
```

---

## Story Patterns

### Pattern 1: Phase Start (Context Gathering)

Every phase should begin with a context gathering story:

```json
{
  "id": "US-001",
  "title": "Understand Scope and Document Approach",
  "description": "Before implementing, explore the codebase and document findings. This prevents wasted effort and ensures we follow established patterns.",
  "tasks": [
    "Read CLAUDE.md for project conventions and commands",
    "Read all files referenced in the PRD description",
    "Check .ralph-tui/progress.md for learnings from previous runs",
    "Identify existing patterns in similar features",
    "List specific files that will be modified",
    "Document approach in .ralph-tui/progress.md",
    "Note any risks or edge cases discovered"
  ],
  "acceptanceCriteria": [
    "progress.md contains approach documentation",
    "All referenced files have been read",
    "Modification plan is specific (file paths, not vague descriptions)"
  ],
  "dependsOn": [],
  "notes": "Reference files: [list them]. This is exploration, not implementation.",
  "passes": false
}
```

### Pattern 2: Implementation Story

Standard feature implementation:

```json
{
  "id": "US-002",
  "title": "Implement [Feature Name]",
  "description": "[What the feature does and why users need it]. This builds on the foundation explored in US-001.",
  "tasks": [
    "Review approach from progress.md",
    "Implement [specific component/function] at [file path]",
    "Follow pattern from [reference file]",
    "Find existing tests (see CLAUDE.md for test locations)",
    "Add test cases for: [list what needs testing]",
    "Run related tests (see CLAUDE.md for test command)",
    "If UI change: verify visually using dev server",
    "Commit changes with descriptive message"
  ],
  "acceptanceCriteria": [
    "Implementation complete at [specific file]",
    "Tests written for new functionality",
    "Related tests pass",
    "Typecheck passes (see CLAUDE.md)",
    "Lint passes (see CLAUDE.md)"
  ],
  "dependsOn": ["US-001"],
  "notes": "Follow pattern in [reference]. Check CLAUDE.md for test commands. Warning: [pitfall to avoid].",
  "passes": false
}
```

### Pattern 3: Bug Fix Story

```json
{
  "id": "US-003",
  "title": "Fix Bug: [Description]",
  "description": "[What's broken and how it manifests]. Users experience [symptom]. Root cause investigation required.",
  "tasks": [
    "Reproduce the bug: [steps or conditions]",
    "Investigate code at [likely location]",
    "Identify root cause (don't assume - confirm)",
    "Implement minimal fix",
    "Add regression test to prevent recurrence",
    "Run tests (see CLAUDE.md for command)",
    "Verify fix visually if UI-related",
    "Commit with fix(scope): description format"
  ],
  "acceptanceCriteria": [
    "Root cause identified and documented in progress.md",
    "Fix implemented with minimal code change",
    "Regression test added",
    "Original bug no longer reproducible",
    "Related tests pass"
  ],
  "dependsOn": [],
  "notes": "Bug report: [reference]. Likely files: [paths]. Warning: May affect [related areas].",
  "passes": false
}
```

### Pattern 4: Phase Checkpoint

End each phase with verification:

```json
{
  "id": "US-010",
  "title": "Phase N Checkpoint: Verify and Document",
  "description": "Verify all Phase N work is complete and properly tested before moving to Phase N+1.",
  "tasks": [
    "Review all Phase N stories are marked complete",
    "Run phase-relevant tests (see CLAUDE.md for test command)",
    "Run typecheck (see CLAUDE.md)",
    "Run lint (see CLAUDE.md)",
    "Update .ralph-tui/progress.md with Phase N summary",
    "Document any gotchas or patterns discovered",
    "Commit all pending changes"
  ],
  "acceptanceCriteria": [
    "All Phase N stories complete (US-XXX through US-YYY)",
    "Related tests pass",
    "Typecheck passes",
    "Lint passes",
    "progress.md contains Phase N summary"
  ],
  "dependsOn": ["US-XXX", "US-YYY", "...all phase stories"],
  "notes": "This is verification, not implementation. If any tests fail, fix them before completing.",
  "passes": false
}
```

### Pattern 5: Final Validation

Last implementation story in every PRD:

```json
{
  "id": "US-FINAL",
  "title": "Final Validation: Full Test Suite",
  "description": "Run the complete test suite to ensure nothing is broken. This MUST pass before the sprint is complete.",
  "tasks": [
    "Run full test suite (see CLAUDE.md for command)",
    "If any test fails, fix it immediately",
    "Run build (see CLAUDE.md for command)",
    "If build fails, fix it immediately",
    "Review all changes with git diff main...HEAD",
    "Update CHANGELOG.md with all changes",
    "Prepare final commit message summary"
  ],
  "acceptanceCriteria": [
    "Full test suite passes with zero failures",
    "Build succeeds",
    "No uncommitted changes remain",
    "CHANGELOG.md updated"
  ],
  "dependsOn": ["all-other-stories"],
  "notes": "DO NOT complete until ALL tests pass. Fix any failures, don't skip them. The deliverable must work. See CLAUDE.md for test and build commands.",
  "passes": false
}
```

### Pattern 6: Sprint Report Generation

Final documentation story:

```json
{
  "id": "US-REPORT",
  "title": "Generate Sprint Report",
  "description": "Create a summary report of all work completed in this sprint for stakeholder review.",
  "tasks": [
    "Read .ralph-tui/progress.md for all documented learnings",
    "Read git log for all commits in this sprint",
    "Create .ralph-tui/report.md with:",
    "  - Summary of what was accomplished",
    "  - List of all stories completed",
    "  - Key decisions and trade-offs made",
    "  - Any known issues or follow-up items",
    "  - Test results summary"
  ],
  "acceptanceCriteria": [
    ".ralph-tui/report.md exists with complete summary",
    "All completed stories listed with brief outcomes",
    "Any blockers or skipped items documented with reasons"
  ],
  "dependsOn": ["US-FINAL"],
  "notes": "This is documentation only. The report helps stakeholders understand what was delivered.",
  "passes": false
}
```

---

## Testing Strategy

### Concepts (Commands in CLAUDE.md)

The specific test commands vary by project. Check CLAUDE.md for:
- How to run individual tests
- How to run the full test suite
- How to run typecheck and lint
- Where test files are located
- What test types exist (unit, integration, e2e)

### When to Write Each Test Type

| Situation | Test Type |
|-----------|-----------|
| New utility function | Unit test |
| New React component | Component test |
| New hook | Hook test |
| API endpoint | Integration test |
| Full user flow | E2E test |
| Visual verification | Manual or browser automation |

### Backpressure Application

- **Per-story**: Run only related tests (not full suite)
- **Per-checkpoint**: Run phase-related tests + typecheck + lint
- **Final validation**: Run complete test suite + build

---

## Completion Signals

| Signal | Meaning | When to Use |
|--------|---------|-------------|
| `<promise>COMPLETE</promise>` | All criteria met | Story fully done, all tests pass |
| `<promise>BLOCKED</promise>` | Need human input | Missing info, unclear requirement |
| `<promise>SKIP</promise>` | Non-critical, can't complete | After genuine attempts, not essential |
| `<promise>EJECT</promise>` | Critical failure | Blocking issue, needs human intervention |

---

## PRD Checklist

Before running the Ralph loop, verify:

**Structure:**
- [ ] First story is context gathering/exploration
- [ ] Each phase ends with a checkpoint story
- [ ] Final stories are validation + report generation
- [ ] All stories have tasks (not just acceptance criteria)

**Quality:**
- [ ] Descriptions explain WHAT and WHY (not HOW)
- [ ] Tasks provide step-by-step instructions
- [ ] Acceptance criteria are specific and verifiable
- [ ] Notes include file paths and CLAUDE.md references

**Verification:**
- [ ] Each story specifies testing expectations
- [ ] UI stories include visual verification step
- [ ] Checkpoint stories run related test suites
- [ ] Final validation runs full test suite

**Backpressure:**
- [ ] Per-story tests are scoped (not full suite)
- [ ] Only final validation runs complete suite
- [ ] CLAUDE.md referenced for all commands

---

## Workflow Summary

1. **Read CLAUDE.md** - Understand project conventions, commands, structure
2. **Analyze** - Understand the request, investigate codebase
3. **Phase** - Divide into logical phases with checkpoints
4. **Calibrate** - Determine right backpressure per story
5. **Write** - Create stories with description, tasks, criteria
6. **Review** - Use the checklist above
7. **Execute** - Run the Ralph loop
8. **Validate** - Full test suite at the end
9. **Report** - Generate sprint summary
