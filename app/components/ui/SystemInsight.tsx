import React from "react";
import { Sparkles } from "lucide-react";

interface SystemInsightProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const SystemInsight: React.FC<SystemInsightProps> = ({
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div 
      className="p-4 rounded-xl border flex gap-3 items-start"
      style={{ 
        backgroundColor: "var(--insight-soft)", 
        borderColor: "var(--insight)",
        color: "var(--text-primary)" 
      }}
    >
      <Sparkles className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--insight)" }} />
      <div className="space-y-1">
        <span className="text-xs font-semibold tracking-wider uppercase block" style={{ color: "var(--insight)" }}>
          ✦ System Insight
        </span>
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>
        
        {actionText && (
          <button
            onClick={onAction}
            className="mt-2 text-xs font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
            style={{ color: "var(--insight)" }}
          >
            [{actionText}]
          </button>
        )}
      </div>
    </div>
  );
};