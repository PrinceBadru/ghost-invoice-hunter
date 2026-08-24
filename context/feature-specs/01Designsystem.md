# Ghost Invoice Hunter — Design System

> **Purpose:** Define the visual language, UI patterns, interaction rules, and design principles for Ghost Invoice Hunter.
>
> This document is the visual source of truth for the application. AI agents and developers must read this file before creating or modifying user-facing UI.

---

# 1. Design System Purpose

Ghost Invoice Hunter is a finance-focused application used to identify, investigate, and resolve financial discrepancies.

The interface must therefore communicate:

- Trust
- Clarity
- Accuracy
- Control
- Professionalism
- Financial seriousness
- Calmness

The UI should feel like a **modern financial operations tool**, not a flashy consumer application.

The design should help a finance user quickly answer:

> **What is wrong?**

> **How much money is affected?**

> **Why is it wrong?**

> **What should I do next?**

---

# 2. Core Design Principles

## 2.1 Clarity Over Decoration

Every visual element should help the user understand or act on information.

Avoid:

- unnecessary gradients
- excessive animations
- decorative illustrations
- excessive shadows
- visual noise
- complicated layouts

Prefer:

- clear hierarchy
- whitespace
- structured cards
- readable tables
- meaningful status indicators
- predictable navigation

---

## 2.2 Financial Information Must Be Easy to Scan

Important financial information should be visually prominent.

For example:

```text
Revenue at Risk
$384,720

should be much easier to notice than secondary metadata.

Prioritize information in this order:

1.Financial impact
2.Problem / status
3.Required action
4.Supporting evidence
5.Metadata

2.3 Status Must Be Immediately Understandable

Users should be able to understand the state of a record without opening it.

Use consistent visual indicators for:

Success
Warning
Error
Informational
Neutral
Pending
Resolved

Do not rely on color alone.

A status should use:

Icon + Label + Color

Example:

⚠ Warning

rather than displaying only a yellow dot.

2.4 Consistency Over Creativity

When a component or pattern already exists, reuse it.

Do not create a new button, card, badge, table, modal, or form style for every feature.

Before creating a new UI pattern:

Search the existing component library.
Determine whether an existing component can be reused.
Extend the existing component if appropriate.
Only create a new component when the existing pattern cannot reasonably support the requirement.
3. Visual Personality

The application should feel:

Professional

The UI should look appropriate for a finance team.

Calm

Users may be reviewing hundreds of discrepancies. The interface should not feel stressful or visually chaotic.

Precise

Numbers, statuses, dates, and financial differences should be presented consistently.

Modern

The application should feel contemporary without relying on trendy visual effects.

Trustworthy

The user should feel that the system is presenting evidence rather than making unexplained claims.

4. Color System

The color system should use a restrained palette.

Color should communicate meaning rather than decoration.

4.1 Primary Color

Use a dark blue / navy family as the primary brand color.

Purpose:

primary actions
active navigation
links
selected states
important interactive elements

The exact color values should be centralized in the application's theme or design tokens.

Do not hard-code primary colors throughout individual components.

4.2 Semantic Colors

Use semantic colors consistently.

Success

Represents:

successfully matched
resolved
approved
completed
healthy

Visual direction:

Green
Warning

Represents:

requires attention
pending review
possible discrepancy
approaching deadline

Visual direction:

Amber / Yellow
Error

Represents:

confirmed discrepancy
failed operation
invalid input
critical issue

Visual direction:

Red
Information

Represents:

additional information
neutral system guidance
informational messages

Visual direction:

Blue
Neutral

Represents:

inactive
draft
unknown
unavailable
secondary information

Visual direction:

Gray
5. Color Usage Rules

Do not use semantic colors purely for decoration.

For example:

❌ Random green card because green looks good

✅ Green badge because the invoice has been successfully matched

Avoid using large areas of saturated colors.

Semantic colors should generally appear in:

badges
icons
borders
alerts
small indicators
status labels

Important financial values may use semantic colors when the color communicates meaningful financial status.

6. Typography

The application should use a clean modern sans-serif font.

Recommended hierarchy:

Page Title
Section Heading
Card Heading
Body Text
Secondary Text
Caption
Typography Principles
Page titles

Large and visually prominent.

Example:

Discrepancies
Section headings

Clearly separate major areas of the page.

Example:

Open Discrepancies
Body text

Easy to read and not overly condensed.

Secondary text

Use for:

timestamps
descriptions
metadata
supporting information

Do not make important information secondary.

7. Numbers and Financial Data

Financial numbers must be highly readable.

Use consistent formatting.

Example:

$21,000.00
$1,500.00
- $350.00

Do not inconsistently display:

$1500
1500 USD
1,500 dollars

within the same interface.

Currency, decimal precision, and negative values should follow a consistent formatting utility.

7.1 Financial Hierarchy

For discrepancy pages, prefer:

Invoice Total
$22,500.00

Purchase Order
$21,000.00

Difference
$1,500.00

The difference should receive the strongest visual emphasis because it represents the financial issue being investigated.

8. Spacing

Use a consistent spacing scale throughout the application.

Prefer a predictable system such as:

4px
8px
12px
16px
24px
32px
48px
64px

Avoid arbitrary spacing values.

Prefer:

padding: 24px

over repeatedly introducing values such as:

padding: 19px
padding: 27px
padding: 23px

Spacing should create hierarchy.

9. Layout

Ghost Invoice Hunter should use a dashboard-style application layout.

Recommended structure:

┌───────────────────────────────────────────────┐
│                 Top Bar                       │
├──────────────┬────────────────────────────────┤
│              │                                │
│  Sidebar     │          Main Content          │
│              │                                │
│  Dashboard   │                                │
│  Invoices    │                                │
│  POs         │                                │
│  Payments    │                                │
│  Issues      │                                │
│  Reports     │                                │
│              │                                │
└──────────────┴────────────────────────────────┘

The sidebar provides navigation.

The main content area contains the active feature.

10. Navigation

Navigation should remain predictable.

Initial navigation structure:

Dashboard

Transactions
├── Invoices
├── Purchase Orders
└── Payments

Reconciliation
├── Discrepancies
└── Investigations

Reports

Settings

Only include navigation items that correspond to implemented functionality.

Do not add navigation items for features that do not exist yet.

11. Sidebar

The sidebar should:

clearly indicate the current page
group related functionality
remain visually quiet
avoid unnecessary decoration

Example:

Ghost Invoice Hunter

Dashboard

TRANSACTIONS
  Invoices
  Purchase Orders
  Payments

RECONCILIATION
  Discrepancies
  Investigations

Reports

Settings

The active navigation item should be visually distinct.

12. Top Bar

The top bar may contain:

page context
search
notifications
user profile
organization selector

Keep the top bar simple.

Do not overload it with actions that belong inside the page.

13. Buttons

Buttons should clearly communicate their purpose.

Primary Button

Used for the main action on a page.

Examples:

+ Add Invoice
Review Discrepancy
Resolve Issue
Save Changes

There should generally be one visually dominant primary action per section.

Secondary Button

Used for supporting actions.

Examples:

Cancel
View Details
Export
Destructive Button

Used for dangerous or irreversible actions.

Examples:

Delete
Reject
Remove

Destructive actions should:

require appropriate confirmation when necessary
clearly explain what will happen
never be visually disguised as normal actions
14. Cards

Cards should group related information.

Good uses:

Revenue at Risk
Open Discrepancies
Recoverable Amount
Recent Investigations

Avoid putting every piece of information inside a card.

Cards should create meaningful grouping rather than simply decorating the page.

15. Dashboard Cards

Dashboard metric cards should follow a consistent structure:

LABEL

VALUE

Supporting context

Example:

Revenue at Risk

$384,720

+8.4% from last month

The main number should be visually dominant.

16. Tables

Tables are a core component of the application because finance users need to review large amounts of structured information.

Tables should prioritize:

readability
scanning
sorting
filtering
predictable alignment

Example:

Invoice       Customer       Amount       Status
-------------------------------------------------------
INV-1024      Acme Ltd       $12,500      ⚠ Review
INV-1025      Beta Ltd       $8,200       ✓ Matched
INV-1026      Gamma Ltd      $21,000       ⚠ Review
16.1 Table Alignment

Generally:

Text        → Left aligned
Numbers     → Right aligned
Status      → Center or left aligned
Actions     → Right aligned

Financial values should generally be right-aligned to make comparison easier.

16.2 Table Actions

Do not place excessive actions in every row.

Prefer:

View

or:

⋮ More

when several secondary actions exist.

17. Status Badges

Use badges for short statuses.

Examples:

✓ Matched
⚠ Needs Review
✕ Discrepancy
◷ Pending
✓ Resolved

Badges should remain compact.

Do not turn every piece of metadata into a badge.

18. Discrepancy Severity

Severity should communicate urgency.

Initial levels:

LOW
MEDIUM
HIGH
CRITICAL

Example:

LOW       Minor difference
MEDIUM    Requires investigation
HIGH      Significant financial impact
CRITICAL  Immediate attention required

Severity should never be determined purely by visual preference.

The backend/domain rules should determine severity.

The frontend only presents it.

19. Discrepancy Page

The discrepancy page is one of the most important screens in the application.

It should answer:

What is wrong?
How much money is affected?
What records are involved?
Why was it detected?
What should the user do?

Recommended layout:

┌──────────────────────────────────────────────┐
│ Price Mismatch                         HIGH  │
│ INV-10025                                    │
├──────────────────────────────────────────────┤
│                                              │
│ Financial Impact                             │
│ $1,500.00                                    │
│                                              │
├─────────────────────┬────────────────────────┤
│ Purchase Order      │ Invoice                │
│                     │                        │
│ $21,000             │ $22,500                │
│ Qty: 500            │ Qty: 500               │
│ Price: $42          │ Price: $45             │
├─────────────────────┴────────────────────────┤
│                                              │
│ Explanation                                  │
│ Invoice unit price differs from PO price.    │
│                                              │
├──────────────────────────────────────────────┤
│              Review / Resolve                │
└──────────────────────────────────────────────┘

The most important discrepancy information should appear above secondary metadata.

20. Investigation Interface

Investigation pages should emphasize evidence.

The UI should make it easy to compare:

Purchase Order
       vs
Invoice
       vs
Payment

Use side-by-side comparison when appropriate.

Avoid hiding important evidence behind many tabs or modals.

21. Forms

Forms should be simple and predictable.

Each field should have:

label
input
helpful description when necessary
validation state
error message when invalid

Example:

Invoice Number
[ INV-10025                 ]

Amount
[ $22,500.00                ]

Due Date
[ 24/08/2026                ]
21.1 Validation

Validation messages should explain:

What went wrong

and, where possible:

How to fix it

Prefer:

Invoice amount must be greater than 0.

over:

Invalid value.
22. Empty States

Empty states should tell the user what is happening and what they can do.

Bad:

No data.

Better:

No discrepancies found

There are currently no unresolved discrepancies.

[ View Reconciliation ]

Empty states should never make an empty page look broken.

23. Loading States

Loading states should communicate that the application is working.

Use:

skeletons
spinners
disabled actions
progress indicators where appropriate

Avoid flashing unrelated UI while data is loading.

24. Error States

Errors should be clear and actionable.

Example:

Unable to load invoices

We couldn't retrieve your invoices right now.

[ Try Again ]

Do not expose raw backend errors to normal users.

For example, avoid displaying:

500 Internal Server Error

as the only message.

Technical details should be logged separately.

25. Confirmation Dialogs

Use confirmation dialogs for actions that are:

destructive
difficult to reverse
financially significant

Example:

Reject Discrepancy?

This will mark the discrepancy as rejected.

[ Cancel ]   [ Reject ]

Do not use confirmation dialogs for every normal action.

26. Modals

Modals should be used sparingly.

Prefer a dedicated page when an action requires:

substantial explanation
multiple fields
evidence comparison
investigation
complex decisions

Use a modal for:

quick confirmations
small forms
lightweight actions
27. Responsive Design

The application should work across:

desktop
laptop
tablet
smaller screens

Desktop is the primary environment because finance users commonly work with tables and dashboards.

However, smaller screens must remain usable.

On smaller screens:

collapse the sidebar
allow tables to scroll horizontally when necessary
stack dashboard cards
avoid tiny text
preserve important financial information

Do not simply shrink desktop layouts until they become unreadable.

28. Accessibility

Accessibility is required.

The UI should:

use semantic HTML
provide labels for inputs
support keyboard navigation
provide visible focus states
maintain sufficient color contrast
provide meaningful button labels
avoid relying on color alone
provide accessible error messages

Example:

❌ Red text only

✅ ⚠ Needs Review
29. Icons

Icons should support understanding, not replace labels when the meaning is ambiguous.

Examples:

🔍 Search
⚠ Warning
✓ Success
✕ Error
↓ Download
↑ Upload

Use one consistent icon library throughout the application.

Do not mix multiple unrelated icon styles.

30. Animation

Animations should be subtle and purposeful.

Acceptable:

hover transitions
menu transitions
modal transitions
loading indicators
small state changes

Avoid:

excessive bouncing
distracting page transitions
animated financial numbers that make values difficult to read
decorative animations

The application is a financial operations tool, not a marketing landing page.

31. Data Visualization

Charts should only be used when they help users understand financial information.

Useful examples:

discrepancy trends
revenue at risk over time
discrepancies by category
resolution time
recoverable amount

Charts should have:

clear labels
readable axes
meaningful legends
accessible descriptions

Do not create charts simply to make the dashboard look impressive.

32. AI-Generated UI Rules

When an AI agent creates UI, it must follow this document.

The AI must:

Read this design system before creating UI.
Reuse existing components whenever possible.
Follow the established spacing and typography system.
Use semantic colors consistently.
Avoid introducing arbitrary colors.
Avoid introducing unnecessary gradients.
Avoid creating unnecessary components.
Maintain responsive behavior.
Maintain accessibility.
Follow existing application patterns.
Check whether a similar screen or component already exists.
Update this design system if a new global design decision is intentionally introduced.
33. Design Tokens

Design values should eventually be centralized.

Example:

const designTokens = {
  colors: {
    primary: "...",
    success: "...",
    warning: "...",
    error: "...",
    info: "...",
    neutral: "...",
  },

  spacing: {
    xs: "...",
    sm: "...",
    md: "...",
    lg: "...",
    xl: "...",
  },

  radius: {
    sm: "...",
    md: "...",
    lg: "...",
  },
};

The actual implementation may use CSS variables, Tailwind configuration, a component-library theme, or another appropriate mechanism.

The important requirement is:

Global design values should have one source of truth.

34. Component Reuse

Before creating a component, ask:

Does this component already exist?
        │
        ├── Yes → Reuse it
        │
        └── No
             │
             ▼
Can an existing component be extended?
        │
        ├── Yes → Extend it
        │
        └── No → Create a new component

Examples of components likely to be reused:

Button
Card
Badge
Input
Select
Modal
Table
Pagination
EmptyState
LoadingState
Alert
35. What Not To Do

Do not:

invent new colors for individual pages
use different button styles for every feature
create inconsistent spacing
use color as the only status indicator
hide important financial information
overload dashboards with charts
use excessive rounded cards
use unnecessary animations
use huge typography for normal application content
introduce a new UI library without a project-level decision
copy a completely different design style from another application
create UI before checking the existing design system
36. Design Decision Rule

When there is uncertainty about a visual decision, prioritize:

Clarity
   ↓
Consistency
   ↓
Accessibility
   ↓
Usability
   ↓
Aesthetics

A beautiful interface that is difficult to understand is not a successful design.

37. Definition of Done — UI

A UI implementation is not complete until:

 It follows this design system.
 Existing components were checked before creating new ones.
 Responsive behavior was considered.
 Loading state exists where necessary.
 Empty state exists where necessary.
 Error state exists where necessary.
 Form validation exists where necessary.
 Accessibility was considered.
 Financial values use consistent formatting.
 Status indicators use the established semantic system.
 No unnecessary visual patterns were introduced.
 The implementation matches the relevant feature specification.
 The progress tracker has been updated.
38. Updating This Design System

This document is a living design system.

A developer or AI agent may update it when a global design decision changes.

Examples:

changing the primary color
changing typography
introducing a new global component
changing spacing conventions
changing navigation conventions
introducing a new semantic status
establishing a new responsive pattern

Do not update this document for one-off page details.

Page-specific requirements belong in the relevant feature specification.

39. Source of Truth Hierarchy

When UI instructions conflict, use this priority:

1. Current implemented design system
        ↓
2. Feature-specific specification
        ↓
3. UI context
        ↓
4. Existing application patterns
        ↓
5. AI design judgment

If a feature intentionally introduces a new global pattern, update this design system before treating that pattern as established.

40. Final Design Goal

Ghost Invoice Hunter should feel like a tool that a finance professional can trust.

The user should be able to open the application and quickly understand:

What is happening?
       ↓
What needs attention?
       ↓
How much money is affected?
       ↓
Why did the system flag it?
       ↓
What should I do next?

The interface should make those answers obvious.

Simple. Precise. Financially focused. Trustworthy.


### One recommendation

I would keep the **actual color hex values out of this first version** until we settle the visual direction for the app. Once we choose the palette, we can add a section like:

```md
## Brand Tokens

| Token | Value | Usage |
|---|---|---|
| Primary | `#...` | Main actions |
| Background | `#...` | App background |
| Surface | `#...` | Cards |
| Text | `#...` | Primary text |
| Muted | `#...` | Secondary text |
| Success | `#...` | Matched/resolved |
| Warning | `#...` | Needs review |
| Error | `#...` | Confirmed issue |

That way the AI won't start inventing colors while you're still deciding what Ghost Invoice Hunter should actually look like.
