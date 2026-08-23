# Architecture Context

## Architecture Goal

Build a maintainable SaaS application with a clear separation between:
- presentation
- API
- business logic
- persistence
- asynchronous processing
- document storage
- AI assistance

Use the simplest architecture that satisfies current requirements.

## Initial Stack

### Frontend
- Next.js
- TypeScript
- React

### Backend
- Python
- FastAPI

### Database
- PostgreSQL

### Background processing
- Redis
- Celery

### Object storage
- S3-compatible storage
- MinIO for local development where useful

### Local orchestration
- Docker Compose

## High-Level Architecture

```text
Browser
   │
   │ HTTPS
   ↓
Next.js
   │
   │ API requests
   ↓
FastAPI
   │
   ├──────────────→ PostgreSQL
   │
   ├──────────────→ Object Storage
   │
   └──────────────→ Redis
                         │
                         ↓
                       Celery
                         │
                ┌────────┼────────┐
                ↓        ↓        ↓
              OCR    Matching   Processing
```

## Backend Layering

Use a clear separation:

```text
API Route
   ↓
Schema / Validation
   ↓
Service / Business Logic
   ↓
Repository / Database Access
   ↓
PostgreSQL
```

Routes should not contain large amounts of business logic.

## Domain Areas

Initial backend modules:

```text
auth
organizations
users
customers
documents
purchase_orders
invoices
payments
matching
discrepancies
reviews
reports
```

## Multi-Tenancy

All organization-owned records must be associated with an organization.

The authenticated user's organization must determine accessible data.

Never rely solely on a client-provided organization identifier.

Tenant isolation must be enforced server-side.

## Data Flow

### Document flow

```text
Upload
  ↓
Validate file
  ↓
Store original
  ↓
Create processing job
  ↓
Extract data
  ↓
Normalize
  ↓
Persist structured records
  ↓
Run matching
  ↓
Generate discrepancies
```

### Reconciliation flow

```text
Invoice
   ↓
Identify related PO
   ↓
Compare customer
   ↓
Compare items
   ↓
Compare quantities
   ↓
Compare prices
   ↓
Compare totals
   ↓
Check payment
   ↓
Generate discrepancy
```

## Matching Architecture

Start with deterministic matching.

Order of preference:

1. Exact identifiers
2. Exact relationships
3. Configured tolerance rules
4. Deterministic item comparison
5. Fuzzy matching
6. AI-assisted matching where justified

AI should supplement the matching engine rather than replace deterministic financial rules.

## Asynchronous Processing

Use background jobs for operations that may be slow or resource-intensive:

- document extraction
- large imports
- batch reconciliation
- report generation
- notifications

Do not introduce asynchronous processing simply because it is technically interesting.

## Financial Data

Financial calculations should remain deterministic.

Use appropriate exact decimal handling for money.

AI-generated text must not be used as the authoritative source for monetary values.

## Auditability

Important events should be recorded, including:
- login/security events where appropriate
- data imports
- discrepancy creation
- discrepancy status changes
- review decisions
- important administrative actions

Audit records should preserve enough information to understand what happened.

## Security Boundaries

Treat these as untrusted:
- uploaded files
- user input
- external API responses
- AI outputs

Validate and authorize at system boundaries.

## External Integrations

Do not build integrations before the core reconciliation workflow works.

Potential future integrations:
- ERP systems
- accounting platforms
- email
- CRM
- payment systems

Each integration should be isolated behind a clear interface.

## Scaling

Do not introduce microservices or Kubernetes in the MVP.

The initial system should be a modular application with clear internal boundaries.

If scale later requires separation, individual domains can be extracted based on measured bottlenecks.

## Architecture Decision Rule

Every architectural addition should answer:

1. What problem does this solve?
2. Why is the current architecture insufficient?
3. What complexity does it introduce?
4. How will it be tested?
5. Is the complexity justified now?

If these questions cannot be answered clearly, do not add the architecture.

## Future Evolution

Potential future additions, only when justified:
- enterprise identity/SSO
- external ERP integrations
- usage-based billing
- advanced ML models
- event-driven integration
- specialized services
- cloud-native scaling

These are not MVP requirements.
