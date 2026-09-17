import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function SystemInsight({
  title,
  description,
  actionText,
  actionHref = "/discrepancies",
}: {
  title: string;
  description: string;
  actionText: string;
  actionHref?: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--insight-soft)] space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[var(--insight)]" />
        <h4 className="text-xs font-semibold text-[var(--text-primary)]">{title}</h4>
      </div>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>
      <Link
        href={actionHref}
        className="inline-flex items-center gap-1 text-xs font-medium text-[var(--insight)] hover:underline"
      >
        {actionText} <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
