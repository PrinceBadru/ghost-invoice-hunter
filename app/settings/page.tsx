"use client";

import React, { useState } from "react";
import { Sliders, Sun, Moon, Laptop, Palette, ShieldAlert } from "lucide-react";

export default function SettingsPage() {
  const [appearance, setAppearance] = useState<"light" | "dark" | "system">("dark");
  const [activeTheme, setActiveTheme] = useState<"signal" | "midnight" | "aurora" | "slate">("signal");
  const [toleranceThreshold, setToleranceThreshold] = useState("5.0");

  const themes = [
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

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
          Settings
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Manage visual language preferences, theme engines, and reconciliation rules.
        </p>
      </div>

      {/* Appearance & Theme Selection (Rule 42) */}
      <div className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <Palette className="w-4 h-4 text-[var(--color-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Appearance & Visual Theme
          </h2>
        </div>

        {/* Mode Selector */}
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
              const isSelected = appearance === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setAppearance(mode.id as any)}
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

        {/* Theme Engine Selector */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold uppercase text-[var(--text-muted)] font-mono">
            Theme Engine
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map((t) => {
              const isSelected = activeTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTheme(t.id as any)}
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

      {/* Operational Rules Configuration */}
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
              Invoices exceeding this percentage variance relative to the PO will automatically trigger a 'Needs Review' status.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 font-mono">
            <input
              type="number"
              value={toleranceThreshold}
              onChange={(e) => setToleranceThreshold(e.target.value)}
              className="w-20 px-3 py-1 text-xs rounded border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] font-bold text-center"
            />
            <span className="text-xs text-[var(--text-muted)]">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}