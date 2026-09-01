import React from "react";
import { ActivityItem } from "@/lib/data";
import { Clock, UserCheck, ShieldAlert } from "lucide-react";

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  return (
    <div className="space-y-4 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        Activity / Audit History
      </div>
      <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-color)]">
        {activities.map((act) => (
          <div key={act.id} className="relative text-xs space-y-0.5">
            <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] ring-4 ring-[var(--bg-surface)]" />
            <div className="flex items-center justify-between font-mono text-[var(--text-muted)]">
              <span>{act.user}</span>
              <span>{act.time}</span>
            </div>
            <div className="font-medium text-[var(--text-primary)]">{act.action}</div>
            {act.detail && <div className="text-[var(--text-secondary)]">{act.detail}</div>}
            {act.reason && (
              <div className="p-2 mt-1 rounded bg-[var(--bg-surface-alt)] border border-[var(--border-color)] text-[var(--text-muted)] font-mono text-[11px]">
                Reason: {act.reason}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};