# Code Standards

## General Principles

- Prefer readable code over clever code.
- Keep functions and components focused.
- Avoid premature abstraction.
- Avoid duplication when abstraction genuinely improves maintainability.
- Use descriptive names.
- Keep business logic separate from presentation.
- Prefer explicit behavior over hidden magic.
- Keep modules cohesive.

## TypeScript / Next.js

- Use TypeScript throughout the frontend.
- Avoid `any` unless there is a documented reason.
- Define types for API responses and important domain objects.
- Prefer server components by default where appropriate.
- Use client components only when client-side behavior is required.
- Keep data fetching and mutation patterns consistent.
- Keep reusable UI components in appropriate component directories.
- Do not put business rules directly inside presentational components.
- Validate external/API data before trusting it.

## React

- Components should have a clear responsibility.
- Avoid unnecessarily large components.
- Extract repeated UI patterns.
- Keep state as local as practical.
- Avoid unnecessary global state.
- Use stable keys for lists.
- Handle loading, empty, error, and success states deliberately.
- Do not hide important business errors behind generic UI messages.

## Python / FastAPI

- Use type hints.
- Keep API routes thin.
- Put business logic in service/domain layers.
- Use Pydantic schemas for API input/output validation.
- Use explicit exception handling for expected failures.
- Do not expose internal exceptions or sensitive information to clients.
- Keep database access organized and testable.
- Avoid circular imports.

## API Standards

- Use clear REST-oriented resource names.
- Use appropriate HTTP methods and status codes.
- Validate request input.
- Validate authorization for every protected resource.
- Enforce organization/tenant ownership at the backend boundary.
- Return consistent error structures.
- Never trust `organization_id` supplied by a client when it can be derived from the authenticated user/session.

## Database Standards

- Use PostgreSQL.
- Use migrations for schema changes.
- Use foreign keys for relationships.
- Add indexes based on actual query patterns.
- Use timestamps consistently.
- Avoid storing duplicated derived data unless there is a clear reason.
- Use transactions for operations that must be atomic.
- Never silently delete financial records.
- Preserve audit history for important state changes.

## Financial Logic

- Use deterministic arithmetic.
- Be explicit about currency.
- Avoid floating-point arithmetic for monetary values when exact decimal representation is required.
- Test edge cases.
- Make tolerance rules explicit and configurable.
- Never let an LLM directly calculate authoritative financial totals.

## Error Handling

Every important user-facing operation should account for:
- loading state
- success state
- validation failure
- authorization failure
- not-found state
- server failure
- retryable failure where appropriate

## Testing

Test:
- core business rules
- discrepancy detection
- matching logic
- financial calculations
- authorization
- tenant isolation
- important API endpoints
- critical UI behavior

Tests should be deterministic and meaningful.

## Git

Use small, focused commits.

Commit messages should describe the change, for example:

```text
feat: add invoice discrepancy detection
fix: enforce organization ownership on invoices
test: cover duplicate invoice detection
refactor: extract reconciliation service
```

Do not commit:
- secrets
- `.env` files containing credentials
- generated build artifacts
- local database files
- unnecessary IDE files

## Documentation

When behavior changes:
- update relevant documentation
- update context files when project decisions change
- update the progress tracker after implementation

Documentation must describe actual behavior, not intended behavior that has not been implemented.
