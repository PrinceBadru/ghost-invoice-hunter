"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Palette, ShieldAlert } from "lucide-react";

const THEMES = [
  {
    id: "signal",
    name: "Signal",
    desc: "Clean, intelligent, default operational theme.",
    color: "#315CFF",
  },
  {
    id: "midnight",
    name: "Midnight",
    desc: "Command center dark theme for high-duration operators.",
    color: "#5B7CFF",
  },
  {
    id: "aurora",
    name: "Aurora",
    desc: "Futuristic analytics with cyan and violet accents.",
    color: "#7C5CFF",
  },
  {
    id: "slate",
    name: "Slate",
    desc: "Conservative, low-stimulation enterprise design.",
    color: "#475569",
  },
];

export function SettingsForm({
  initialTolerance,
  canEdit,
}: {
  initialTolerance: number;
  canEdit: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const [activeThemeEngine, setActiveThemeEngine] = useState("signal");
  const [tolerance, setTolerance] = useState(String(initialTolerance));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("gih-theme-engine");
    if (stored) {
      setActiveThemeEngine(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  function selectThemeEngine(id: string) {
    setActiveThemeEngine(id);
    document.documentElement.setAttribute("data-theme", id);
    window.localStorage.setItem("gih-theme-engine", id);
  }

  async function handleSaveThreshold() {
    setError(null);
    setSaved(false);
    const res = await fetch("/api/environment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toleranceThreshold: parseFloat(tolerance) }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not save");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <Palette className="w-4 h-4 text-[var(--color-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Appearance & Visual Theme
          </h2>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-[var(--text-muted)] font-mono">
            Appearance Mode
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light", label: "Light", icon: Sun },
              { id: "dark", label: "Dark", icon: Moon },
              { id: "system", label: "System", icon: Laptop },
            ].map((mode) => {
              const Icon = mode.icon;
              const isSelected = theme === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setTheme(mode.id)}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-center gap-2 font-medium transition-all ${
                    isSelected
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold"
                      : "border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {mode.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold uppercase text-[var(--text-muted)] font-mono">
            Theme Engine
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEMES.map((t) => {
              const isSelected = activeThemeEngine === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => selectThemeEngine(t.id)}
                  className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                    isSelected
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]/20 ring-1 ring-[var(--color-primary)]"
                      : "border-[var(--border-color)] bg-[var(--bg-surface-alt)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[var(--text-primary)]">
                      {t.name}
                    </span>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    {t.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <ShieldAlert className="w-4 h-4 text-[var(--warning)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Discrepancy & Threshold Rules
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="text-xs font-semibold text-[var(--text-primary)]">
              Default Price Variance Tolerance (%)
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              Invoices exceeding this percentage variance relative to the PO
              will automatically trigger a 'Needs Review' or 'Discrepancy'
              status.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 font-mono">
            <input
              type="number"
              step="0.1"
              disabled={!canEdit}
              value={tolerance}
              onChange={(e) => setTolerance(e.target.value)}
              className="w-20 px-3 py-1 text-xs rounded border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] font-bold text-center disabled:opacity-60"
            />
            <span className="text-xs text-[var(--text-muted)]">%</span>
            {canEdit && (
              <button
                onClick={handleSaveThreshold}
                className="ml-2 px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
              >
                Save
              </button>
            )}
          </div>
        </div>
        {!canEdit && (
          <p className="text-[11px] text-[var(--text-muted)]">
            Only master or admin accounts can change this.
          </p>
        )}
        {saved && <p className="text-[11px] text-[var(--success)]">Saved.</p>}
        {error && <p className="text-[11px] text-[var(--danger)]">{error}</p>}
      </div>
    </div>
  );
}
