# Ghost Invoice Hunter — Dashboard Feature Specification

> **Feature:** Dashboard
>
> **File:** `context/feature-specs/02Dashboard.md`
>
> **Status:** Planned
>
> **Purpose:** Define the requirements, layout, behavior, data, and implementation rules for the Ghost Invoice Hunter dashboard.
>
> The Dashboard is the primary landing page for authenticated finance users.

---

# 1. Feature Purpose

The Dashboard provides finance users with a quick overview of the organization's financial reconciliation activity.

The dashboard should answer five questions immediately:

1. **How much money is currently at risk?**
2. **How many discrepancies need attention?**
3. **How much money may be recoverable?**
4. **What are the most important issues right now?**
5. **What should I investigate next?**

The Dashboard is an **overview**, not the place where users perform detailed investigations.

Users should be able to identify an issue on the Dashboard and navigate to the appropriate feature for deeper investigation.

---

# 2. Primary User

The primary dashboard user is a finance professional.

Initial supported roles:

- Finance Analyst
- Finance Manager
- Administrator

The dashboard should adapt to the user's permissions.

A user must never see financial information belonging to an organization they do not have access to.

---

# 3. Dashboard Goals

The Dashboard should:

- provide an immediate overview of financial discrepancies
- highlight financial impact
- surface high-priority issues
- show reconciliation activity
- provide useful shortcuts to deeper workflows
- avoid overwhelming the user
- allow users to move quickly from overview → investigation

---

# 4. Dashboard Information Hierarchy

Information should appear in this general priority:

```text
1. Financial impact
        ↓
2. Issues requiring attention
        ↓
3. Reconciliation activity
        ↓
4. Trends
        ↓
5. Secondary information

6. Dashboard Header

The dashboard should begin with a clear heading.

Example:

Dashboard

Overview of your organization's reconciliation activity

The heading should not be unnecessarily large.

The user should immediately know:

where they are
what the page represents
7. Organization Context

If the application supports multiple organizations, the current organization must be obvious.

Example:

Organization
Acme Corporation

The dashboard must only retrieve and display data belonging to the currently selected organization.

If an organization selector exists elsewhere in the application, the Dashboard must respect that selection.

8. KPI Cards

The Dashboard should initially contain four primary KPI cards.

┌─────────────────┐
│ Revenue at Risk │
│                 │
│ $384,720        │
│                 │
│ +8.4%           │
└─────────────────┘

┌─────────────────┐
│ Open Issues     │
│                 │
│ 247             │
│                 │
│ 32 High Priority│
└─────────────────┘

┌─────────────────┐
│ Recoverable     │
│                 │
│ $142,350        │
│                 │
│ 37% of risk     │
└─────────────────┘

┌─────────────────┐
│ Invoices        │
│ Analyzed        │
│                 │
│ 12,842          │
│                 │
│ This period     │
└─────────────────┘

These values are examples only.

The application must use real data from the backend once the relevant functionality exists.

9. KPI: Revenue at Risk
Purpose

Shows the estimated financial value currently associated with unresolved discrepancies.

Example:

Revenue at Risk

$384,720

This should be the most prominent KPI.

Definition

For the MVP, Revenue at Risk should represent:

The total monetary value associated with currently open discrepancies according to the application's discrepancy calculation rules.

The exact calculation must be implemented in backend/domain logic.

The frontend must not independently calculate the authoritative value.

Display

The dashboard should display:

formatted currency
currency symbol/code where appropriate
current period/context
optional comparison with a previous period if supported by backend data
10. KPI: Open Issues
Purpose

Shows the number of unresolved discrepancies.

Example:

Open Issues

247

32 High Priority

The card should make it possible to quickly understand whether there is a significant investigation workload.

Interaction

Clicking the card should navigate to:

Discrepancies

with the appropriate filter applied.

Example:

/discrepancies?status=open

The exact route should follow the application's routing conventions.

11. KPI: Recoverable Amount
Purpose

Shows the estimated amount that may be recovered or corrected from identified discrepancies.

Example:

Recoverable

$142,350

37% of revenue at risk

The backend must define how recoverable amounts are calculated.

The frontend must display the value rather than inventing its own calculation.

12. KPI: Invoices Analyzed
Purpose

Shows the volume of invoices processed during the relevant reporting period.

Example:

Invoices Analyzed

12,842

This month

The reporting period should be explicit.

Avoid displaying a number without explaining its period.

13. KPI Comparison Values

If comparison data exists, the dashboard may show:

+8.4% from previous period

or:

↓ 12% from previous period

Comparison values must only be displayed when the backend provides enough information to calculate them reliably.

Do not fabricate trends.

14. Financial Overview

The Dashboard should include a financial overview visualization.

The initial chart may show:

Revenue at Risk Over Time

Example concept:

Revenue
at Risk

$400k ┤                 ╭──╮
      │            ╭────╯  │
$300k ┤       ╭────╯       ╰──╮
      │  ╭────╯               │
$200k ┤──╯                    ╰──
      │
      └────────────────────────────
        Week 1  Week 2  Week 3  Week 4

The exact chart library will be determined by the application's implementation stack.

15. Chart Requirements

The chart should:

have a clear title
have readable labels
communicate the time period
use consistent currency formatting
provide accessible information
avoid unnecessary visual decoration

The chart should not exist merely to make the Dashboard visually impressive.

16. Chart Empty State

If insufficient historical data exists:

Financial Overview

Not enough data to display a trend yet.

Continue processing invoices to see financial trends here.

Do not render a misleading empty chart.

17. High Priority Discrepancies

The Dashboard should display a small list of high-priority unresolved discrepancies.

Example:

High Priority Discrepancies

Invoice       Type              Impact       Status
--------------------------------------------------------
INV-1024      Price mismatch    $12,500      High
INV-1041      Duplicate         $8,200       High
INV-1055      PO mismatch       $6,400       High

                         [ View All ]

The purpose is to help users decide what to investigate next.

18. Discrepancy Table Columns

The initial Dashboard discrepancy table should contain:

Column	Purpose
Invoice	Identify the affected invoice
Type	Identify the discrepancy
Customer	Identify the related customer
Financial Impact	Show monetary importance
Severity	Show urgency
Status	Show current state
Action	Open investigation

Only include additional columns when they provide meaningful value.

19. Discrepancy Sorting

Default sorting should prioritize the issues that matter most.

Recommended priority:

Critical
   ↓
High
   ↓
Medium
   ↓
Low

Within the same severity, higher financial impact should generally appear first.

The backend should ideally perform sorting where the dataset is large.

20. Discrepancy Actions

Each Dashboard discrepancy should provide a clear action.

Preferred action:

View

or:

Investigate

The user should be taken to the discrepancy/investigation page.

Do not implement complex investigation functionality directly inside the Dashboard.

21. Recent Investigations

The Dashboard should provide a lightweight summary of recent investigation activity.

Example:

Recent Investigations

INV-1024
Price mismatch
Resolved
2 hours ago

INV-1031
Duplicate invoice
Rejected
5 hours ago

INV-1042
Partial payment
Under Review
Yesterday

This section provides visibility into recent work without replacing the full Investigation feature.

22. Investigation Actions

Clicking a recent investigation should navigate to its detailed investigation page.

The Dashboard should not contain the full investigation workflow.

23. Quick Actions

The Dashboard may provide a small set of useful actions.

Initial candidates:

+ Add Invoice

View Discrepancies

View Investigations

Only display actions that correspond to implemented features.

Do not create buttons for future functionality.

24. Filters

The initial Dashboard should remain simple.

If filters are required, the first useful filters should be:

Date Range
Organization

Additional filters may be added later.

Avoid adding:

ten different dropdowns
complex query builders
unnecessary filter panels

The Dashboard is an overview.

Detailed filtering belongs on feature-specific pages such as Discrepancies.

25. Date Range

The Dashboard should eventually support a reporting period such as:

Today
Last 7 days
Last 30 days
This month
Custom range

However, only implement options supported by the backend.

The selected date range should clearly affect the displayed metrics.

26. Loading State

The Dashboard must provide an appropriate loading state.

Do not show:

Revenue at Risk
$0

while the actual value is still loading.

Use skeletons or another appropriate loading pattern.

Example:

Revenue at Risk

████████████
████████

Each major dashboard section should avoid unnecessary layout shifting while data loads.

27. Error State

If Dashboard data cannot be retrieved:

Unable to load dashboard

We couldn't retrieve your financial overview.

[ Try Again ]

If only one section fails, do not necessarily make the entire dashboard unusable.

For example:

Revenue Metrics
✓ Loaded

Financial Trend
⚠ Unable to load

[ Retry ]
28. Empty Dashboard

A new organization may have no financial records.

The Dashboard should handle this gracefully.

Example:

Welcome to Ghost Invoice Hunter

No financial records have been analyzed yet.

Add your first invoice to begin reconciliation.

[ Add Invoice ]

Do not display meaningless:

$0
0 issues
0 invoices

without context.

29. Permissions

Dashboard data must respect user permissions.

Users should only see:

organizations they belong to
financial records they are authorized to access
actions allowed by their role

The frontend should not be treated as the security boundary.

Authorization must also be enforced by the backend.

30. Dashboard API Requirements

The frontend should obtain Dashboard information through backend APIs.

A conceptual endpoint may be:

GET /api/dashboard

or:

GET /api/dashboard/summary

The exact endpoint should follow the backend architecture.

31. Suggested Dashboard Response

A conceptual response may look like:

{
  "revenue_at_risk": {
    "amount": 384720,
    "currency": "USD"
  },
  "open_discrepancies": {
    "count": 247,
    "high_priority": 32
  },
  "recoverable_amount": {
    "amount": 142350,
    "currency": "USD"
  },
  "invoices_analyzed": {
    "count": 12842,
    "period": "month"
  },
  "financial_trend": [],
  "priority_discrepancies": [],
  "recent_investigations": []
}

This is a conceptual contract.

Do not implement the exact structure without confirming it against the actual backend design.

32. Backend Responsibility

The backend is responsible for:

retrieving authorized data
calculating authoritative financial metrics
applying business rules
calculating discrepancy counts
calculating financial impact
determining severity
applying organization/tenant isolation
returning data in a predictable format

The frontend is responsible for:

displaying the data
formatting values
handling interaction
displaying loading states
displaying errors
navigating to detailed features
33. Financial Calculation Rule

The Dashboard frontend must never become the source of truth for financial calculations.

For example, do not implement:

const revenueAtRisk =
  invoices.reduce(...) - payments.reduce(...);

unless the backend contract explicitly defines that calculation as a presentation-only transformation.

Authoritative financial calculations belong in backend/domain logic.

34. Currency Formatting

Currency values should use a shared formatting utility.

Example:

$384,720.00

rather than implementing formatting separately in every component.

The system should eventually support multiple currencies.

The Dashboard must respect the currency returned by the backend.

35. Responsive Behavior
Desktop

Desktop is the primary Dashboard environment.

Recommended layout:

4 KPI cards
      ↓
Large financial chart
      ↓
Priority discrepancies
      ↓
Recent investigations
Tablet

KPI cards may become:

2 × 2

rather than four cards across.

Mobile

KPI cards should stack:

Card
Card
Card
Card

Tables may require horizontal scrolling or a responsive card representation.

Do not shrink financial values to the point where they become difficult to read.

36. Accessibility

The Dashboard must:

use semantic headings
provide accessible labels
support keyboard navigation
provide visible focus states
not rely on color alone
provide accessible chart information
provide meaningful button labels
maintain adequate contrast

Charts must have an accessible textual representation where appropriate.

37. Performance

The Dashboard is a high-frequency page.

It should load efficiently.

Avoid:

unnecessary API calls
fetching large invoice datasets just to calculate KPIs
rendering thousands of rows
duplicate requests
unnecessary client-side calculations

The Dashboard API should return summary information rather than entire datasets.

38. Data Refresh

The initial implementation may use:

Load data when Dashboard opens.

Automatic real-time updates are not required for the first implementation.

If the user performs an action that changes Dashboard data, the relevant metrics should be refreshed appropriately.

39. Out of Scope

The initial Dashboard does not include:

real-time financial streaming
AI-generated financial forecasts
autonomous financial decisions
complex BI reporting
custom dashboard builders
drag-and-drop widgets
user-created dashboard layouts
advanced predictive analytics
external ERP analytics
production financial integrations

These belong to future iterations.

40. Component Structure

A possible frontend component structure:

Dashboard/
│
├── DashboardPage
│
├── DashboardHeader
│
├── DashboardFilters
│
├── DashboardMetrics
│   ├── RevenueAtRiskCard
│   ├── OpenIssuesCard
│   ├── RecoverableAmountCard
│   └── InvoicesAnalyzedCard
│
├── FinancialOverview
│
├── PriorityDiscrepancies
│
└── RecentInvestigations

The exact component structure may change based on the existing application architecture.

Do not create components purely to match this tree.

Component boundaries should reflect actual reuse and responsibility.

41. State Management

Use the application's established state-management approach.

Do not introduce a new state-management library specifically for the Dashboard without an architectural decision.

Dashboard state may include:

Loading
Success
Error
Empty

and, where applicable:

Selected date range
Selected organization
42. Routing

The Dashboard should be the default landing page after successful authentication unless the application architecture specifies another route.

A possible route:

/dashboard

The exact route must follow the application's established routing conventions.

43. Navigation Relationships

The Dashboard connects users to deeper features.

Dashboard
   │
   ├──► Invoices
   │
   ├──► Purchase Orders
   │
   ├──► Payments
   │
   ├──► Discrepancies
   │
   └──► Investigations

The Dashboard should not duplicate the functionality of those pages.

It should provide a useful summary and clear paths into them.

44. Design System Compliance

All Dashboard UI must follow:

context/feature-specs/01Designsystem.md

This includes:

typography
spacing
colors
buttons
cards
tables
badges
responsive behavior
accessibility
loading states
error states

If this specification conflicts with the global design system, the global design system remains the visual source of truth unless a deliberate feature-specific exception is documented.

45. AI Implementation Rules

When an AI agent implements the Dashboard, it must:

Read 01Designsystem.md.
Read the relevant project architecture context.
Inspect the existing frontend structure.
Inspect existing reusable components.
Inspect existing API patterns.
Avoid inventing backend data that does not exist.
Use mock data only when explicitly requested or temporarily required during foundation work.
Clearly separate mock data from production data.
Follow existing routing conventions.
Follow existing state-management conventions.
Implement loading, empty, and error states.
Consider responsive behavior.
Consider accessibility.
Run relevant tests/lint/type checks.
Update context/06-progress-tracker.md after implementation.
46. Scope Change Rule

If implementing the Dashboard reveals a requirement that changes the product scope, architecture, or global UI conventions:

STOP
  ↓
Document the change
  ↓
Update the relevant context file
  ↓
Continue implementation

Examples:

introducing a new database service
introducing a new state-management library
adding real-time infrastructure
adding a new global UI pattern
changing the definition of Revenue at Risk
introducing a new user role

Do not silently change project scope during implementation.

47. Definition of Done

The Dashboard is considered complete when:

Structure
 Dashboard route exists.
 Dashboard is accessible to authorized users.
 Layout follows the design system.
 Navigation correctly identifies Dashboard as active.
Metrics
 Revenue at Risk is displayed.
 Open Issues are displayed.
 Recoverable Amount is displayed.
 Invoices Analyzed is displayed.
 Financial values use consistent formatting.
Discrepancies
 High-priority discrepancies are displayed.
 Financial impact is visible.
 Users can navigate to discrepancy details.
 Sorting/filtering behavior is consistent with the specification.
Investigations
 Recent investigations are displayed.
 Users can navigate to investigation details.
States
 Loading state exists.
 Error state exists.
 Empty state exists.
Responsive
 Desktop layout works.
 Tablet layout works.
 Mobile layout remains usable.
Accessibility
 Semantic headings exist.
 Keyboard navigation works.
 Focus states are visible.
 Status is not communicated through color alone.
Engineering
 Backend authorization is enforced.
 Tenant isolation is enforced.
 Financial calculations come from authoritative backend/domain logic.
 Relevant tests pass.
 Lint/type checks pass where configured.
 context/06-progress-tracker.md has been updated.
48. Future Enhancements

Potential future Dashboard features include:

advanced financial analytics
customizable date ranges
richer trend analysis
anomaly trends
predictive revenue leakage
AI-generated summaries
customizable dashboard widgets
scheduled reports
exportable reports
real-time updates
organization benchmarking

These are future possibilities, not MVP requirements.

49. Final Product Principle

The Dashboard should never attempt to show everything.

Its job is to answer:

"What do I need to know and act on right now?"

A successful Dashboard allows a finance user to open Ghost Invoice Hunter and understand within seconds:

How much money is at risk?
        ↓
How many issues exist?
        ↓
Which issues matter most?
        ↓
What has recently been investigated?
        ↓
Where should I go next?

The Dashboard is the command center for financial reconciliation, not a replacement for the detailed feature pages.
