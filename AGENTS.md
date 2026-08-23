<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Ghost Invoice Hunter — AI App-Building Context

## Mission

You are an AI coding agent working on Ghost Invoice Hunter.

Your responsibility is to help build a production-quality, portfolio-grade business application while preserving the project's documented product scope, architecture, UI direction, code standards, and progress history.

## Required Context Files

Before making any implementation change, read:

1. `context/01-project-overview.md`
2. `context/02-ai-workflow-rules.md`
3. `context/03-code-standards.md`
4. `context/04-ui-context.md` when working on UI
5. `context/05-architecture-context.md` when working on architecture/backend/data/infrastructure
6. `context/06-progress-tracker.md`

This file establishes the workflow. The other files contain the detailed project decisions.

## Mandatory Workflow

For every implementation task:

### Step 1 — Read context

Read the relevant context files before touching code.

### Step 2 — Inspect the codebase

Understand:
- existing files
- current implementation
- dependencies
- tests
- related components
- current architecture

Do not assume that a file is empty or that an earlier implementation does not exist.

### Step 3 — Identify scope

Determine whether the requested work is:
- already in scope
- a refinement of existing scope
- a new feature
- an architecture change

### Step 4 — Plan

Choose the smallest coherent implementation that satisfies the task.

Avoid unnecessary dependencies and abstractions.

### Step 5 — Check for scope changes

If the implementation requires a change to:
- product goals
- user flows
- features
- MVP boundaries
- architecture
- UI principles
- coding standards

STOP.

Update the relevant context file first.

Then update `context/06-progress-tracker.md` with the decision.

Only after those files are synchronized may implementation continue.

### Step 6 — Implement

Make the code change.

Follow:
- `context/03-code-standards.md`
- `context/04-ui-context.md`
- `context/05-architecture-context.md`

as applicable.

### Step 7 — Validate

Run the most relevant available checks:
- tests
- lint
- type checking
- build
- API checks
- database/migration checks

Do not claim a check passed unless it was actually run.

### Step 8 — Review

Review the change for:
- correctness
- security
- tenant isolation
- maintainability
- unnecessary complexity
- consistency with context

### Step 9 — Update progress

After EVERY implementation change, update:

`context/06-progress-tracker.md`

Record:
- date
- implementation change
- affected area
- status
- validation
- decisions

This is mandatory.

### Step 10 — Synchronize context

If the implementation changed a documented decision, update the relevant context file.

The codebase and context folder must remain synchronized.

## Important Rules

### Never silently change scope

If you discover that the feature requires something not covered by the current scope, stop and update the documentation before proceeding.

### Never overwrite blindly

Do not replace working code merely to match a preferred coding style.

Understand the existing code first.

### Never invent completed work

The progress tracker must reflect actual implementation status.

### Never fabricate metrics

Do not claim:
- customers
- revenue recovered
- accuracy
- performance
- users
- production results

unless those results were actually obtained.

Use synthetic/demo data and clearly label it.

### Never expose secrets

Do not commit:
- API keys
- passwords
- tokens
- credentials
- private certificates
- real customer financial information

### Never trust AI output blindly

AI-generated extraction, matching, explanations, or recommendations must be treated as untrusted output.

Financial truth comes from validated source data and deterministic business logic.

### Preserve human control

Consequential financial actions require explicit human approval in the MVP.

### Prefer simplicity

Do not introduce:
- microservices
- Kubernetes
- complex distributed systems
- unnecessary packages
- unnecessary state management
- unnecessary AI agents

unless the project requirements genuinely justify them.

## Definition of Done

A task is done only when:

- [ ] Requested behavior implemented
- [ ] Relevant code follows project standards
- [ ] Relevant tests/checks run
- [ ] No known security issue introduced
- [ ] Context remains synchronized
- [ ] Progress tracker updated
- [ ] Scope changes documented if applicable

## When Unsure

Do not guess silently.

State the ambiguity, inspect the relevant context/code, and make the smallest defensible decision.

## Agent Handoff

Another AI agent should be able to open this repository and understand the current state by reading the `context/` directory and inspecting the codebase.

The context folder is therefore part of the project's engineering infrastructure, not temporary notes.

