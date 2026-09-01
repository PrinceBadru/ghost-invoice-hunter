import React from "react";
import { CheckCircle2, AlertTriangle, AlertOctagon, Clock, Archive, FileText, XCircle } from "lucide-react";

export type InvoiceStatus = "Draft" | "Processing" | "Matched" | "Needs Review" | "Discrepancy" | "Approved" | "Rejected" | "Archived";
export type Severity = "Low" | "Medium" | "High" | "Critical";

interface StatusBadgeProps {
  status: InvoiceStatus;
  severity?: Severity;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, severity }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "Matched":
      case "Approved":
        return { icon: CheckCircle2, bg: "var(--success-soft)", color: "var(--success)" };
      case "Needs Review":
        return { icon: AlertTriangle, bg: "var(--warning-soft)", color: "var(--warning)" };
      case "Discrepancy":
      case "Rejected":
        return { icon: AlertOctagon, bg: "var(--danger-soft)", color: "var(--danger)" };
      case "Processing":
        return { icon: Clock, bg: "var(--info-soft)", color: "var(--info)" };
      default:
        return { icon: FileText, bg: "var(--bg-surface-alt)", color: "var(--text-secondary)" };
    }
  };

  const { icon: Icon, bg, color } = getStatusConfig();

  return (
    <div 
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
      style={{ backgroundColor: bg, borderColor: color, color }}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{status}</span>
      {severity && <span className="opacity-75 text-[10px] uppercase font-bold ml-1">({severity})</span>}
    </div>
  );
};