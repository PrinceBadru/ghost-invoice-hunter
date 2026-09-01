"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useThemeVariant, ThemeVariant } from "@/components/providers/ThemeProvider";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const { activeTheme, setThemeVariant } = useThemeVariant();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const themes: { id: ThemeVariant; label: string }[] = [
    { id: "signal", label: "Signal" },
    { id: "midnight", label: "Midnight" },
    { id: "aurora", label: "Aurora" },
    { id: "slate", label: "Slate" },
  ];

  return (
    <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4 w-72">
      {/* 1. Appearance (Light / Dark / System) */}
      <div>
        <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
          Appearance
        </label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-[var(--bg-surface-alt)] rounded-lg text-xs">
          {["light", "dark", "system"].map((mode) => (
            <button
              key={mode}
              onClick={() => setTheme(mode)}
              className={`py-1 capitalize rounded-md text-center transition-colors ${
                theme === mode
                  ? "bg-[var(--bg-surface)] font-semibold shadow-xs text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Theme Variant */}
      <div>
        <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
          Theme
        </label>
        <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--bg-surface-alt)] rounded-lg text-xs">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setThemeVariant(t.id)}
              className={`py-1.5 rounded-md text-center transition-colors ${
                activeTheme === t.id
                  ? "bg-[var(--bg-surface)] font-semibold shadow-xs text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};