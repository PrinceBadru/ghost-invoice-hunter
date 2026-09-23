import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import type { DocStatus, Severity } from "@/lib/types";

const STATUS_STYLES: Record<
  string,
  { bg: string; fg: string; icon: React.ElementType }
> = {
  Matched: {
    bg: "var(--success-soft)",
    fg: "var(--success)",
    icon: CheckCircle2,
  },
  Resolved: {
    bg: "var(--success-soft)",
    fg: "var(--success)",
    icon: CheckCircle2,
  },
  "Needs Review": {
    bg: "var(--warning-soft)",
    fg: "var(--warning)",
    icon: AlertTriangle,
  },
  Discrepancy: { bg: "var(--danger-soft)", fg: "var(--danger)", icon: XCircle },
  Rejected: { bg: "var(--danger-soft)", fg: "var(--danger)", icon: XCircle },
  Processing: { bg: "var(--info-soft)", fg: "var(--info)", icon: Loader2 },
  Failed: { bg: "var(--danger-soft)", fg: "var(--danger)", icon: XCircle },
};

const SEVERITY_STYLES: Record<string, string> = {
  Low: "var(--success)",
  Medium: "var(--warning)",
  High: "var(--danger)",
};

export function StatusBadge({
  status,
  severity,
}: {
  status: DocStatus | string;
  severity?: Severity | string | null;
}) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.Processing;
  const Icon = style.icon;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold"
        style={{ backgroundColor: style.bg, color: style.fg }}
      >
        <Icon className="w-3 h-3" />
        {status}
      </span>
      {severity && (
        <span
          className="text-[10px] font-mono font-medium"
          style={{ color: SEVERITY_STYLES[severity] ?? "var(--text-muted)" }}
        >
          {severity}
        </span>
      )}
    </span>
  );
}
