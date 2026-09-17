export type Role = "MASTER" | "ADMIN" | "UPLOADER" | "VIEWER";
export type DocType = "PURCHASE_ORDER" | "QUOTE" | "INVOICE";
export type DocStatus = "Processing" | "Matched" | "Needs Review" | "Discrepancy" | "Failed";
export type Severity = "Low" | "Medium" | "High";

export const ROLES_THAT_CAN_MANAGE_USERS: Role[] = ["MASTER", "ADMIN"];
export const ROLES_THAT_CAN_MANAGE_SETTINGS: Role[] = ["MASTER", "ADMIN"];

// Shape handed from server components down to client components — keeps the
// original UI's prop shapes intact even though the data now comes from the DB.
export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  vendor: string;
  vendorId: string;
  invoiceDate: string;
  poNumber: string;
  quoteNumber: string;
  poAmount: number;
  quoteAmount: number;
  invoiceAmount: number;
  status: DocStatus;
  severity: Severity | null;
  discrepancyScore: number;
  scoreReasons: string[];
}

export interface AuditEntry {
  id: string;
  time: string;
  user: string;
  action: string;
  detail?: string;
  reason?: string;
}
