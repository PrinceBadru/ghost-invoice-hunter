# UI Context

## Product UI Goal

The UI should feel like a serious B2B financial operations product.

It should communicate:
- trust
- clarity
- control
- financial impact
- explainability

Avoid making the application look like a generic AI dashboard.

## Primary Design Principle

> Show the financial consequence first, then the underlying data.

For example, prefer:

```text
Potentially Recoverable
$142,350
```

over:

```text
1,247 discrepancies
```

Both can be displayed, but the financial consequence gets priority.

## Core Navigation

The initial authenticated application should provide access to:

- Dashboard
- Documents
- Invoices
- Purchase Orders
- Payments
- Discrepancies
- Reviews / Investigations
- Reports
- Administration

Navigation should make the user's current location obvious.

## Dashboard

The dashboard should prioritize:

1. Revenue at risk
2. Potentially recoverable amount
3. Open/high-priority discrepancies
4. Invoice processing status
5. Trends
6. Highest-value issues
7. Recent investigations

Avoid excessive charts. Every visualization should answer a business question.

## Discrepancy List

The discrepancy table should support:
- search
- filtering
- sorting
- severity
- type
- customer
- amount
- status
- date

High-value or high-severity discrepancies should be visually distinguishable without relying on color alone.

## Investigation View

The investigation page is a primary product differentiator.

It should clearly compare:

```text
Purchase Order
        vs
Invoice
        vs
Payment
```

Show the exact fields responsible for the discrepancy.

Example:

```text
Unit price
PO:      $42.00
Invoice: $45.00
Difference: +$3.00
```

Then show:
- system explanation
- confidence where applicable
- recommended action
- evidence
- review controls
- audit history

## Human-in-the-Loop

AI recommendations must never be presented as irreversible actions.

Use clear controls such as:
- Approve
- Reject
- Assign
- Request review

The UI should make it clear when a human is responsible for the final decision.

## States

Every important screen should account for:

- loading
- empty
- error
- unauthorized
- not found
- success
- processing

## Forms

Forms should:
- use clear labels
- validate close to the relevant field
- preserve user input when possible
- explain errors
- avoid unnecessary fields
- clearly distinguish required and optional fields

## Tables

Tables should:
- support readable scanning
- avoid excessive columns
- use meaningful formatting
- show useful status information
- provide a clear route to detail views

## Accessibility

Follow accessible web practices:
- semantic HTML
- keyboard navigation
- visible focus states
- sufficient contrast
- labels for form controls
- accessible error messages
- meaningful button text
- do not rely on color alone

## Responsive Design

The application is primarily a desktop B2B application, but important workflows should remain usable on smaller screens.

Do not optimize mobile responsiveness at the expense of the primary desktop finance workflow.

## Visual Restraint

Avoid:
- excessive gradients
- unnecessary animations
- decorative AI imagery
- giant marketing sections inside operational screens
- excessive rounded cards
- information overload

The UI should feel like a tool professionals can use for hours.
