# AI Workflow Rules

## Purpose

These rules govern how an AI coding agent must work on Ghost Invoice Hunter.

## Mandatory Context Loading

Before implementing or modifying anything:

1. Read `context/AGENTS.md`.
2. Read `context/01-project-overview.md`.
3. Read `context/02-ai-workflow-rules.md`.
4. Read `context/03-code-standards.md`.
5. Read `context/04-ui-context.md` when the task affects UI.
6. Read `context/05-architecture-context.md` when the task affects architecture, backend, data flow, infrastructure, or dependencies.
7. Read `context/06-progress-tracker.md` to understand current project state.

Do not start implementation until the relevant context has been reviewed.

## Source of Truth

The context files are project constraints, not suggestions.

When a requested implementation conflicts with them:
- identify the conflict
- do not silently ignore it
- update the relevant context file if the project decision is intentionally changing
- record the change in the progress tracker
- only then continue implementation

## Scope Change Rule

If an implementation changes the product scope:

1. Stop before continuing the implementation.
2. Identify which scope or architecture decision is changing.
3. Update the relevant context file.
4. Record the scope change in `context/06-progress-tracker.md`.
5. Then continue the implementation using the updated context.

Never allow the codebase and context documentation to silently diverge.

## Implementation Workflow

For every task:

1. Understand the requested behavior.
2. Inspect the existing implementation.
3. Read relevant context files.
4. Identify affected components/modules.
5. Plan the smallest coherent change.
6. Implement the change.
7. Run relevant tests, linting, type checking, or build checks.
8. Review the resulting diff.
9. Update `context/06-progress-tracker.md`.
10. Update other context files if the implementation changed documented decisions.
11. Report what changed and what checks were run.

## Progress Tracking Rule

After every implementation change, update `context/06-progress-tracker.md`.

The update should record:
- date
- change
- affected area
- current status
- validation performed
- notable decisions
- next relevant step

Do not leave the progress tracker stale.

## No Blind Overwriting

Never replace an existing implementation simply because a cleaner example is possible.

First understand:
- existing behavior
- dependencies
- naming
- architecture
- tests
- related components

Prefer incremental changes.

## No Speculative Features

Do not add:
- extra screens
- extra endpoints
- new dependencies
- new services
- new database entities
- AI features
- infrastructure

unless they are required by the task or explicitly approved.

## Business Logic Rule

Financial calculations must be deterministic and testable.

AI may:
- extract information
- assist matching
- explain results
- draft communications

AI must not silently become the authoritative source for:
- invoice totals
- payment amounts
- discrepancy amounts
- financial calculations
- authorization decisions

## Security Rule

Assume all uploaded documents and external inputs are untrusted.

Use:
- validation
- authorization
- tenant checks
- safe file handling
- secure secrets management
- auditability

Never hard-code credentials or secrets.

## Dependency Rule

Before adding a dependency, verify that:
- the functionality is genuinely needed
- existing dependencies cannot reasonably solve the problem
- the dependency is compatible with the project
- its addition does not unnecessarily increase architectural complexity

## Completion Rule

A task is not complete merely because the code compiles.

Consider the task complete only when:
- implementation is finished
- relevant tests/checks pass
- context is synchronized
- progress tracker is updated
- no known scope conflict remains

## Communication Rule

When reporting work:
- state what was implemented
- state files/modules affected
- state validation performed
- mention any assumptions
- mention any context/scope changes
- do not claim tests passed if they were not run
