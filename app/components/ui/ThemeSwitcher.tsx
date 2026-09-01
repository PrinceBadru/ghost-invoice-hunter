"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4 w-72">
      <div>
        <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
          Appearance
        </label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-[var(--bg-surface-alt)] rounded-lg text-xs">
          {["light", "dark", "system"].map((mode) => (
            <button
              key={mode}
              onClick={() => setTheme(mode)}
              className="py-1 capitalize rounded-md text-center transition-colors"
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};