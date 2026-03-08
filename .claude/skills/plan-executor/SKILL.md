---
name: plan-executor
description: Execute implementation plans from docs/plans/* using parallel agent teams. Use when you have a plan document to implement, need to break down tasks and assign to agents, or want coordinated multi-agent implementation with code review. Triggers on "implement the plan", "execute docs/plans/...", "run the tasks from", or when user provides a plan document path.
---

# Plan Executor

Execute implementation plans using maximally parallel agent teams with automatic code review and best-practice enforcement.

## Usage

```
/plan-executor <plan-path> [--new-branch] [--branch-name <name>]
```

**Parameters:**
- `<plan-path>`: Path to the plan document (required). Can be relative to project root or absolute.
- `--new-branch`: Create a new branch for implementation (default: use current branch)
- `--branch-name <name>`: Custom branch name (implies --new-branch)

**Examples:**
```
/plan-executor docs/plans/phase1/2026-03-07-task-1.1-implementation.md
/plan-executor docs/plans/phase2/2026-03-07-tasks-2.1-2.10-backend.md --new-branch
/plan-executor phase3/search-sharing.md --branch-name feature/search-sharing
```

## Core Principle: Maximum Parallelization

**The goal is speed.** Spawn as many agents as possible in parallel. The only constraint is task dependencies.

```
Instead of:
  Agent 1 (BE) → Agent 2 (FE) → Agent 3 (Infra)  [sequential]

Do this:
  Agent 1 (Task 1.1.1) ─┐
  Agent 2 (Task 1.1.2) ─┼─→ Code Review Agent
  Agent 3 (Task 1.1.3) ─┤
  Agent 4 (Task 1.1.4) ─┘
  [all in parallel]
```

## Workflow

### Phase 1: Parse and Build Dependency Graph

1. **Read the plan document** using the Read tool
2. **Extract ALL tasks** (look for `## Task X.X.X:` or similar headers)
3. **For each task, extract:**
   - Task ID (e.g., `1.1.3`)
   - Task title/description
   - Files to create/modify
   - Explicit dependencies (mentioned in plan)
   - Implicit dependencies (files needed from other tasks)

4. **Build dependency graph:**
   ```
   Task 1.1.1 (no deps) ─────┐
   Task 1.1.2 (no deps) ─────┼─→ Task 1.1.5 (needs 1.1.1-1.1.4)
   Task 1.1.3 (no deps) ─────┤         │
   Task 1.1.4 (no deps) ─────┘         ▼
                              Task 1.1.6 (needs 1.1.5)
   ```

5. **Identify execution waves:**
   - **Wave 1:** All tasks with no dependencies (MAXIMUM PARALLELISM)
   - **Wave 2:** Tasks that only depend on Wave 1
   - **Wave N:** Tasks that depend on Wave N-1

### Phase 2: Branch Setup

Based on the `--new-branch` flag:

```bash
# If --new-branch or --branch-name specified:
git checkout -b <branch-name-or-auto-generated>

# Auto-generate branch name from plan: feature/phase1-task-1.1-backend-init
```

If using current branch, verify clean working directory first.

### Phase 3: Task Classification for Skill Activation

**Classify each task individually** (not grouped by layer):

| Task Pattern | Primary Skill | Agent Type Tag |
|--------------|---------------|----------------|
| Domain entity, value object | architecture-patterns | `domain` |
| Repository interface/impl | architecture-patterns | `repository` |
| Service layer, business logic | architecture-patterns | `service` |
| GraphQL resolver, schema | architecture-patterns | `resolver` |
| Middleware, auth | architecture-patterns | `middleware` |
| React component, UI | frontend-design | `component` |
| Page, route | frontend-design | `page` |
| Custom hook | vercel-react-best-practices | `hook` |
| Jotai atom, state | vercel-react-best-practices | `state` |
| GraphQL client, queries | vercel-react-best-practices | `graphql-client` |
| Docker, docker-compose | - | `docker` |
| Database config, models | - | `database` |
| Environment, config files | - | `config` |
| Mixed/unclear | Both skills | `mixed` |

### Phase 4: Parallel Agent Execution

**Spawn agents at the TASK level, not the LAYER level.**

#### Execution Strategy

```
Wave 1 (4 independent tasks):
┌─────────────────────────────────────────────────────────────┐
│  spawn Agent(task-1.1.1)  │  spawn Agent(task-1.1.2)        │
│  spawn Agent(task-1.1.3)  │  spawn Agent(task-1.1.4)        │
│  [ALL 4 IN ONE MESSAGE - MAXIMUM PARALLELISM]              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (wait for all to complete)
Wave 2 (2 tasks depending on Wave 1):
┌─────────────────────────────────────────────────────────────┐
│  spawn Agent(task-1.1.5)  │  spawn Agent(task-1.1.6)        │
│  [BOTH IN PARALLEL]                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                         Code Review
```

**CRITICAL:** In each wave, spawn ALL agents in a SINGLE message with multiple Agent tool calls. Do not wait between agents in the same wave.

#### Subtask Parallelization

For complex tasks with independent substeps, spawn multiple agents:

```
Task 1.1.5 has 4 independent substeps:
- Create Entity
- Create Repository Interface
- Create Repository Impl
- Create Service

Instead of 1 agent doing all 4 sequentially:
  spawn Agent(1.1.5-entity)
  spawn Agent(1.1.5-repo-interface)
  spawn Agent(1.1.5-repo-impl)
  spawn Agent(1.1.5-service)
  [ALL 4 IN PARALLEL]
```

#### Agent Prompt Template

```markdown
You are implementing Task {TASK_ID} from the plan.

**Task:** {TASK_DESCRIPTION}

**Files to create/modify:**
- {FILE_LIST}

**Task Type:** {TASK_TYPE} - Use the `{PRIMARY_SKILL}` skill if available.

**Requirements:**
- Follow CLAUDE.md conventions
- TypeScript strict mode compliance
- Follow the exact steps in the plan for this specific task

**After implementation:**
- Run: `bun run lint` or `npm run lint`
- Run: `bunx tsc --noEmit`

DO NOT commit - the orchestrator will handle commits.
DO NOT work on other tasks - focus only on Task {TASK_ID}.
```

### Phase 5: Per-Task Commits

After each task's agent completes:

```bash
# Stage only files related to this task
git add <specific-files-for-this-task>

# Commit with descriptive message (NO AI attribution)
git commit -m "type(scope): description of what was done"
```

**IMPORTANT:** Never include "Co-Authored-By" or any AI attribution in commits.

### Phase 6: Code Review Agent

After all tasks complete, spawn a single review agent:

```markdown
Review all code changes made in this implementation session.

**Files changed:** {ALL_MODIFIED_FILES}

**Review Checklist:**

1. **Convention Compliance** (reference CLAUDE.md):
   - File naming conventions
   - TypeScript strict mode
   - React functional components
   - Clean Architecture layers

2. **Edge Cases:**
   - Null/undefined handling
   - Empty array/object handling
   - Error boundaries and error handling

3. **Potential Bugs:**
   - Race conditions
   - Memory leaks
   - Missing error handling

4. **Impact Analysis:**
   - Breaking changes
   - New dependencies

**Output:**
- Issues by severity (critical, high, medium, low)
- Recommendations
- Files needing follow-up
```

### Phase 7: Final Verification

```bash
# Backend
cd backend && bun run lint && bunx tsc --noEmit && bun test

# Frontend
cd frontend && npm run lint && npm run type-check && npm run test
```

## Parallelization Decision Tree

```
Parse Plan
    │
    ▼
Extract all tasks
    │
    ▼
Build dependency graph
    │
    ▼
Identify execution waves
    │
    ├── Wave 1 has N independent tasks?
    │       │
    │       ├── Yes → Spawn N agents in parallel (single message)
    │       │
    │       └── No (sequential deps only) → Spawn 1 agent at a time
    │
    ▼
For each task:
    │
    ├── Has independent subtasks?
    │       │
    │       ├── Yes → Spawn multiple agents for subtasks
    │       │
    │       └── No → Single agent for task
    │
    ▼
Commit per completed task
    │
    ▼
Code review (1 agent)
    │
    ▼
Verification
```

## Practical Limits

While the goal is maximum parallelization, be practical:

- **Recommended max agents per wave:** 8-10
- **If more than 10 independent tasks:** Group by logical affinity (e.g., all entity tasks together)
- **Subtask parallelization limit:** 4-5 agents per complex task

## Error Handling

**If a task fails:**
1. Mark the task as failed
2. Check if downstream tasks can still proceed (they may not need this task)
3. Report error clearly
4. Allow retry for failed task only

**If linting fails:**
1. Run `lint:fix` automatically
2. Report remaining errors
3. Do not commit until fixed

**If tests fail:**
1. Report failing tests
2. Ask user whether to proceed

## Integration with Existing Skills

Invoke skills from within agents using the Skill tool:

- `architecture-patterns` - For backend Clean Architecture tasks
- `frontend-design` - For UI/components/pages
- `vercel-react-best-practices` - For hooks, state, performance

## Output Summary

After execution:

```markdown
# Implementation Summary

## Branch: <branch-name>

## Execution Waves

| Wave | Tasks | Agents Spawned | Status |
|------|-------|----------------|--------|
| 1 | 1.1.1-1.1.4 | 4 parallel | ✅ |
| 2 | 1.1.5-1.1.6 | 2 parallel | ✅ |

## Tasks Completed: X/Y

| Task | Agent | Status | Files | Commit |
|------|-------|--------|-------|--------|
| 1.1.1 | domain | ✅ | 2 | abc123 |
| 1.1.2 | repository | ✅ | 3 | def456 |
| 1.1.3 | service | ✅ | 2 | ghi789 |
| ... | ... | ... | ... | ... |

## Code Review Results

- **Critical:** 0 | **High:** 1 | **Medium:** 3 | **Low:** 5

## Verification

- Linting: ✅ | Type Check: ✅ | Tests: ✅

## Next Steps

1. [Recommendations]
```

## Plan Document Format

Expected format:

```markdown
# Task X.X: Title - Implementation Plan

**Goal:** [what this accomplishes]
**Architecture:** [context]
**Tech Stack:** [technologies]

---

## Task X.X.1: Subtask Title

**Files:**
- Create: `path/to/file.ts`
- Modify: `path/to/existing.ts`

**Dependencies:** Task X.X.0 (if any)

**Step 1: [action]**
[implementation details]

**Step N: Commit**
[commit instructions]

---

## Success Criteria Checklist

- [ ] Criterion 1
- [ ] Criterion 2
```
