# Ghost Invoice Hunter: AI Agent Implementation Plan & Context

## Overview
This document serves as the master context and workflow guide for an AI agent to iteratively implement the required improvements for the **Ghost Invoice Hunter** project. The goal is to elevate the project from a promising prototype to a production-ready, credible portfolio piece with robust core matching, solid parsing, comprehensive CI/CD, and an impressive public presentation.

This context is derived from the comprehensive product and content analysis report.

## Agentic Workflow Instructions
When acting upon this plan, the AI agent must follow this workflow for **each task**:
1. **Plan & Contextualize:** Review the task requirements in this document and read the relevant existing source files.
2. **Implement:** Write the code changes.
3. **Test & Verify:** Write accompanying unit or integration tests. Run the test suite and typechecker locally to ensure no regressions.
4. **CI/CD Integration:** Ensure the changes are covered by the Continuous Integration pipeline. Do not mark a task complete unless the CI pipeline (Lint, Typecheck, Test, Build) would pass.
5. **Iterate:** Address any issues or edge cases before moving to the next task.

---

## Phase 1: Foundation & Credibility (High Priority)
**Goal:** Ensure a fresh install works flawlessly, the repository points to the live deployment, and basic CI is established.

### 1.1 Branch & Deployment Synchronization
- **Context:** The `development` branch contains the Vercel/Supabase setup and `proxy.ts` updates, but `master` relies on Docker/SQLite.
- **Task:** 
  - Compare `master` and `development`. Establish `development` (Vercel/Supabase) as the source of truth.
  - Merge `development` into `master` (or update `master` to reflect the production setup).
- **CI/CD Integration:** Ensure GitHub Actions trigger on pushes/PRs to `master` to validate the production branch.

### 1.2 Dependency & Build Fixes
- **Context:** `next-themes@0.3.0` has a peer dependency conflict with React 19 causing `npm install` to fail on a fresh clone.
- **Task:** 
  - Upgrade or remove `next-themes` to support React 19 cleanly.
  - Regenerate `package-lock.json` so that `npm install` runs without `--legacy-peer-deps`.
  - Fix any deprecations (e.g., migrating `middleware.ts` to `proxy.ts` if not already fully resolved).
- **CI/CD Integration:** CI must run `npm ci` seamlessly without dependency conflicts.

### 1.3 Testing & CI Pipeline Implementation
- **Context:** The project currently lacks automated tests and a robust CI pipeline.
- **Task:**
  - Setup a test framework (e.g., Jest or Vitest).
  - Add a GitHub Actions workflow (`.github/workflows/ci.yml`) that includes:
    - Dependency installation (`npm ci`)
    - TypeScript compilation check (`tsc --noEmit`)
    - Linting (`npm run lint`)
    - Automated testing (`npm test`)
    - Production build (`npm run build`)
- **CI/CD Integration:** This establishes the core pipeline that all future changes will rely on.

---

## Phase 2: Core Engineering Upgrades
**Goal:** Fix the product's financial data handling and API security.

### 2.1 Role-Based Access Control (RBAC) Enforcement
- **Context:** Upload routes and other write/mutation routes lack strict role checks before execution.
- **Task:** 
  - Implement a `requireRole` server-side helper (e.g., `requireRole(["MASTER", "ADMIN", "UPLOADER"])`).
  - Apply this guard to all API routes and Server Actions that mutate data (file uploads, settings changes, business updates).
- **CI/CD Integration:** Add unit/integration tests verifying that unauthorized roles (like `VIEWER`) receive a `403 Forbidden` error. CI must execute these auth tests.

### 2.2 Financial Data Parsing Robustness
- **Context:** Spreadsheet parsing is too optimistic, filling missing fields with silent defaults (quantity `1`, amount `0`), which breaks financial integrity.
- **Task:** 
  - Implement strict column mapping and row validation.
  - Reject malformed rows and return explicit validation warnings/errors.
  - Transition from standard JS floating-point arithmetic to a decimal handling strategy for financial accuracy.
  - Standardize currency and locale handling (fix hardcoded instances of USD vs UGX in generated text).
- **CI/CD Integration:** Write parser tests for valid, malformed, and edge-case spreadsheets. CI must validate parser integrity.

---

## Phase 3: The "Wow Factor" (Line-Level Matching)
**Goal:** Upgrade the discrepancy engine from naive document-total matching to robust line-item matching.

### 3.1 Line-Level Three-Way Matching
- **Context:** The system currently compares the total of the PO vs the total of the Invoice. This misses critical edge cases (e.g., wrong quantity, changed unit price, shipping offsets).
- **Task:**
  - Update the matching algorithm to perform a line-level comparison between the invoice and PO.
  - Implement explicit variance reason codes:
    - Missing PO / Quote
    - Quantity over-billed
    - Unit price variance
    - Tax / Shipping / Fee mismatch
    - Duplicate invoice candidate
    - Currency mismatch
- **CI/CD Integration:** Build an extensive suite of test cases simulating various mismatch scenarios. CI must enforce that the matching engine handles these accurately.

### 3.2 Exception Investigation Workflow & UI
- **Context:** The UI needs to visually explain *why* an invoice failed, rather than just showing a raw score.
- **Task:**
  - Build a side-by-side document/line comparison view.
  - Highlight the specific offending line items (e.g., rendering the over-billed amount in red).
  - Provide an interactive resolution workflow: "Approve", "Reject", or "Request Correction", with full audit logging.
- **CI/CD Integration:** Write component or end-to-end tests ensuring the resolution actions correctly update the database state.

---

## Phase 4: Polish & Presentation
**Goal:** Prepare the repository to impress recruiters, engineers, and potential buyers.

### 4.1 Update README & Public Proof
- **Context:** The repository README currently reflects a local developer diary rather than a production SaaS tool.
- **Task:**
  - Place the live Vercel/Supabase demo URL prominently at the top.
  - Provide clear instructions for demo accounts.
  - Insert a high-quality 60-second GIF demonstrating a flagged invoice exception.
  - Update architecture documentation to reflect the Supabase/Vercel stack, moving Docker/SQLite to a "Local Development" section.
  - Clearly state current capabilities and roadmap limitations.
- **CI/CD Integration:** Ensure Markdown files are properly formatted. Adding status badges (CI passing, etc.) to the README.
