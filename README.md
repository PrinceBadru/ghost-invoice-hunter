# Ghost Invoice Hunter 👻 🕵️‍♂️

An agentic, multi-environment invoice discrepancy reconciliation engine.

![Build Status](https://github.com/PrinceBadru/ghost-invoice-hunter/actions/workflows/ci.yml/badge.svg)

Ghost Invoice Hunter automatically ingests Purchase Orders, Quotes, and Invoices, parses their line items with strict validations, and executes a robust **line-level 3-way matching engine** to catch over-billing, missing items, pricing variances, and duplicate invoices before they drain your business.

## 🚀 Key Features

- **Multi-Environment Silos**: Each user belongs to exactly one Environment. Data is strictly siloed—businesses tracked in one environment cannot be accessed by another.
- **Role-Based Access Control (RBAC)**: Secure server-side guards enforcing `MASTER`, `ADMIN`, `UPLOADER`, and `VIEWER` permissions on mutational routes.
- **Robust Spreadsheet Parsing**: Upload `.xlsx` or `.csv` files. The ingestion engine enforces strict column validations, generates granular row errors for malformed data, and leverages `decimal.js` for precise financial arithmetic.
- **Line-Level 3-Way Matching Engine**: Deep discrepancy detection at the line-item level. Automatically flags:
  - Quantity over-billed
  - Unit price variances (above environment tolerance)
  - Missing PO lines
  - Unmatched Tax/Freight rows
  - Duplicate invoice candidates
- **Interactive Discrepancy UI**: Side-by-side visual document comparison highlighting offending line items in red. Includes an interactive resolution workflow (Resolve, Request Correction, or Reject) with full immutable audit logging.
- **Continuous Integration**: Backed by Vitest for unit/component testing and GitHub Actions for CI.

## 🏗 Architecture

- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS (v4) with CSS Variables for dynamic themes
- **Database:** PostgreSQL (via Supabase) with Prisma ORM
- **Testing:** Vitest + React Testing Library
- **Linting:** Biome

## 🛠 Getting Started

### Deployment (Vercel & Supabase)

The easiest way to deploy this application is using Vercel for the frontend and Supabase (PostgreSQL) for the database.

1. **Database Setup**:
   - Create a new Supabase project.
   - Get your PostgreSQL connection strings.
2. **Environment Variables**:
   - Set `DATABASE_URL` (Connection Pooling) and `DIRECT_URL` (Direct Connection) in your Vercel project settings.
   - Set `JWT_SECRET` to a random, secure string.
3. **Deployment**:
   - Import your repository into Vercel.
   - Vercel is configured via `vercel.json` to use `npm ci --legacy-peer-deps` for installation.
   - Ensure you run database migrations against your Supabase project by locally executing `npm run db:migrate`.

### Local Development

To run the application locally:

```bash
npm install
npm run db:push      # pushes the Prisma schema to your PostgreSQL database
npm run db:seed      # optional — adds a demo environment + sample data
npm run dev
```

Then visit <http://localhost:3001>. Either:

- **Sign up** to create your own environment, or
- Log in with the seeded demo account: `sarah@acme.test` / `password123`

### Testing & Linting

```bash
npm test             # Run Vitest test suite
npm run lint         # Run Biome linting & formatting checks
```
