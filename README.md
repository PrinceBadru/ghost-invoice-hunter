# Ghost Invoice Hunter

Multi-environment invoice discrepancy reconciliation app.

## Architecture

- Each **User** belongs to exactly one **Environment** (a closed silo — nothing
  is shared or queried across environments).
- A **Business** is tracked _inside_ an environment (a department, or an
  outside company whose invoices are processed there).
- A master account creates the environment on signup, then creates other
  users directly inside it (`ADMIN` / `UPLOADER` / `VIEWER` roles).
- Uploading a Purchase Order, Quote, or Invoice spreadsheet parses it,
  stores normalized line items, and — for invoices — runs the discrepancy
  matching engine immediately (`lib/matching.ts`).

## Getting started

### Run with Docker (Recommended)

The easiest way to deploy and run the app is using Docker:

```bash
docker-compose up -d --build
```

The app will be available at http://localhost:3001 with a persistent SQLite database.

### Local Development

If you prefer running without Docker:

```bash
npm install
npm run db:push      # creates dev.db (SQLite) from prisma/schema.prisma
npm run db:seed      # optional — adds a demo environment + sample data
npm run dev
```

Then visit http://localhost:3001. Either:

- **Sign up** to create your own environment, or
- Log in with the seeded demo account: `sarah@acme.test` / `password123`

## What's implemented

- Auth (JWT in an httpOnly cookie), environment-scoped middleware
- Environment signup (creates environment + master account)
- Adding users within an environment (master/admin only)
- Adding businesses tracked inside an environment
- File upload (.xlsx / .csv) → parsing → line items → document totals
- Discrepancy matching engine (invoice vs PO vs quote, tolerance-based)
- All pages wired to the real database (no more mock data)
- Full Docker & Docker Compose deployment support with persistent SQLite storage

## Deliberately simplified for this pass (see build plan for next steps)

- Matching is done at the **document total** level, not line-item level.
  Line items are stored, so line-item-level matching is a targeted upgrade
  later, not a schema change.
- Spreadsheet column detection is heuristic (common header name variants).
  A stricter template or column-mapping UI is a good v2 addition once real
  business spreadsheets show which formats actually show up.
- No password reset / email verification flow yet.
- No automated tests or CI yet — this pass was scoped
  to "build the whole system first," per your request.
