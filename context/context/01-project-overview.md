# Ghost Invoice Hunter — Project Overview

## Purpose

Ghost Invoice Hunter is a multi-tenant accounts-receivable intelligence platform that helps finance teams identify revenue leakage and reduce manual reconciliation work.

The product analyzes purchase orders, invoices, and payment records to detect discrepancies, explain why they occurred, prioritize investigations, and support human-approved resolution workflows.

## Product Positioning

> Find money that finance teams may have missed and reduce the time required to investigate it.

This is not intended to replace an accounting or ERP system. It is an intelligence and workflow layer that works with existing financial data.

## Goals

1. Detect invoice, purchase-order, and payment discrepancies.
2. Surface the financial impact of detected discrepancies.
3. Explain discrepancies clearly enough for a finance employee to investigate them.
4. Provide a human-in-the-loop review and resolution workflow.
5. Give managers a clear view of revenue at risk and investigation performance.
6. Support multiple organizations with strict tenant isolation.
7. Demonstrate production-quality software engineering through testing, security, auditability, and maintainable architecture.
8. Use AI where it provides meaningful assistance without making AI the source of truth for financial calculations.

## Core User Flow

```text
Login
  ↓
Dashboard
  ↓
Upload/import financial data
  ↓
Document/data processing
  ↓
Normalization
  ↓
Matching engine
  ↓
Discrepancy detection
  ↓
Prioritization
  ↓
Investigation
  ↓
Human decision
  ↓
Resolution / rejection
  ↓
Audit trail
```

## Core Users

### Finance Analyst

Primary operational user.

Can:
- upload/import documents and data
- view invoices and purchase orders
- run or monitor reconciliation
- investigate discrepancies
- review recommendations
- approve or reject proposed actions
- view relevant reports

### Finance Manager

Can:
- perform analyst functions
- view organization-wide analytics
- assign investigations
- approve higher-value actions
- monitor team performance

### Administrator

Can:
- manage users
- manage roles
- manage organization settings
- view audit logs
- manage integrations/configuration

## Features In Scope

### Authentication and authorization
- Login/logout
- Secure password handling
- Role-based access control
- Organization/tenant isolation

### Organization management
- Organizations
- Users
- Roles
- Organization settings

### Financial data
- Customers
- Purchase orders
- Purchase-order items
- Invoices
- Invoice items
- Payments
- Uploaded documents

### Reconciliation and matching
- Invoice ↔ purchase-order matching
- Invoice ↔ payment matching
- Exact matching
- Configurable tolerance rules
- Duplicate detection
- Basic fuzzy matching when appropriate

### Discrepancy detection

Initial discrepancy types:
- `PO_MISMATCH`
- `PRICE_MISMATCH`
- `QUANTITY_MISMATCH`
- `TOTAL_MISMATCH`
- `DUPLICATE_INVOICE`
- `PARTIAL_PAYMENT`
- `OVERPAYMENT`
- `OVERDUE`
- `MISSING_PAYMENT`

Each discrepancy should contain:
- type
- severity
- financial amount where applicable
- status
- confidence where applicable
- explanation
- timestamps
- audit history

### Investigation workflow
- Discrepancy detail view
- Evidence comparison
- Explanation
- Recommended action
- Human approval/rejection
- Assignment
- Resolution status
- Audit trail

### Dashboard and reporting
- Revenue at risk
- Potentially recoverable amount
- Open discrepancies
- Invoices analyzed
- Discrepancy trends
- Discrepancies by type/customer
- Resolution metrics

### AI-assisted capabilities
- Document information extraction
- Entity/fuzzy matching assistance
- Natural-language discrepancy explanations
- Draft resolution/dispute messages

AI recommendations must remain reviewable and must not silently modify financial records.

### Data and testing
- Synthetic demo dataset
- Known planted discrepancies
- Automated evaluation of detection accuracy
- Performance measurements

## Features Out of Scope for the Initial MVP

Do not implement these unless scope is explicitly changed and this document is updated first:

- Payment processing
- Autonomous financial transactions
- Full accounting/ERP replacement
- Mobile application
- Kubernetes
- Microservices
- Enterprise SSO/SAML
- Stripe billing
- Large-scale external integrations
- Advanced predictive ML models
- Production use of real customer financial data
- Autonomous dispute submission
- Compliance certification claims
- Unnecessary infrastructure complexity

These may become future roadmap items.

## Success Criteria

The MVP is successful when:

1. A user can securely sign in.
2. Organizations cannot access one another's data.
3. A user can import representative invoices, purchase orders, and payments.
4. The system can normalize and match those records.
5. Known discrepancy types are detected reliably.
6. A finance user can inspect the evidence behind a discrepancy.
7. The system explains the discrepancy clearly.
8. A human can approve, reject, assign, and resolve an investigation.
9. Important actions are recorded in an audit trail.
10. The dashboard communicates financial impact rather than only record counts.
11. The system can process the agreed synthetic evaluation dataset.
12. Detection accuracy, false positives, and processing performance can be measured.
13. Automated tests cover important business logic and API behavior.
14. The application can be run locally using documented setup instructions.

## Product Principles

- Business value over feature count.
- Accuracy over flashy AI.
- Human approval for consequential actions.
- Explainability over black-box behavior.
- Security and tenant isolation by default.
- Build the simplest architecture that solves the current problem.
- Measure important behavior instead of making unsupported claims.
