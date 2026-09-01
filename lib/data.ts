export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  poNumber: string;
  quoteNumber: string;
  vendor: string;
  vendorId: string;
  invoiceDate: string;
  invoiceAmount: number;
  poAmount: number;
  quoteAmount: number;
  status: "Draft" | "Processing" | "Matched" | "Needs Review" | "Discrepancy" | "Approved" | "Rejected" | "Archived";
  severity: "Low" | "Medium" | "High" | "Critical";
  discrepancyScore: number;
  scoreReasons: string[];
  addedBy: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  time: string;
  user: string;
  action: string;
  detail?: string;
  reason?: string;
}

export const MOCK_INVOICES: InvoiceRecord[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-10492",
    poNumber: "PO-8821",
    quoteNumber: "QT-4401",
    vendor: "Acme Logistics Ltd",
    vendorId: "VND-001",
    invoiceDate: "2026-08-28",
    invoiceAmount: 12850.00,
    poAmount: 12000.00,
    quoteAmount: 12000.00,
    status: "Needs Review",
    severity: "High",
    discrepancyScore: 88,
    scoreReasons: ["7.08% price variance above 5% threshold", "High transaction volume vendor"],
    addedBy: "Sarah K.",
    updatedAt: "10 mins ago"
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-10493",
    poNumber: "PO-8822",
    quoteNumber: "QT-4402",
    vendor: "Apex Supplies",
    vendorId: "VND-002",
    invoiceDate: "2026-08-29",
    invoiceAmount: 4100.00,
    poAmount: 4100.00,
    quoteAmount: 4100.00,
    status: "Matched",
    severity: "Low",
    discrepancyScore: 0,
    scoreReasons: ["Perfect match across Quote, PO, and Invoice"],
    addedBy: "David M.",
    updatedAt: "1 hour ago"
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-10494",
    poNumber: "PO-8825",
    quoteNumber: "QT-4409",
    vendor: "Global Cloud Services",
    vendorId: "VND-003",
    invoiceDate: "2026-08-30",
    invoiceAmount: 24500.00,
    poAmount: 18000.00,
    quoteAmount: 18000.00,
    status: "Discrepancy",
    severity: "Critical",
    discrepancyScore: 96,
    scoreReasons: ["36.11% major price variance", "Critical risk exposure > $5,000"],
    addedBy: "System Auto-Import",
    updatedAt: "2 hours ago"
  }
];

export const MOCK_AUDIT_TRAIL: ActivityItem[] = [
  { id: "1", time: "14:32", user: "Sarah K.", action: "Added invoice INV-10492" },
  { id: "2", time: "14:34", user: "System", action: "Detected price discrepancy (+7.08%)", reason: "Exceeds default 5% tolerance threshold" },
  { id: "3", time: "14:35", user: "System", action: "Assigned for review", detail: "Assigned to David M." },
  { id: "4", time: "15:02", user: "David M.", action: "Opened invoice for inspection" }
];