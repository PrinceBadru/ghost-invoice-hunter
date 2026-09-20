"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Ghost } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Something went wrong");
        return;
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-app)] p-6">
      <div className="w-full max-w-sm space-y-6">
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4"
        >
          <div className="flex items-center gap-2 justify-center pb-2">
            <Ghost className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="font-display font-bold text-[var(--text-primary)]">
              Ghost Invoice Hunter
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

          {error && <p className="text-xs text-[var(--danger)]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60 transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-xs text-center text-[var(--text-secondary)]">
            New environment?{" "}
            <Link
              href="/signup"
              className="text-[var(--color-primary)] font-medium hover:underline"
            >
              Set one up
            </Link>
          </p>
        </form>

        <div className="space-y-3">
          <p className="text-xs font-medium text-center text-[var(--text-secondary)] uppercase tracking-wider">
            Demo Accounts (Click to login)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Sarah K.", role: "Master", email: "sarah@acme.test" },
              { name: "Jane A.", role: "Admin", email: "jane@acme.test" },
              { name: "David M.", role: "Uploader", email: "david@acme.test" },
              { name: "Bob V.", role: "Viewer", email: "bob@acme.test" },
            ].map((demo) => (
              <button
                key={demo.email}
                type="button"
                onClick={() => {
                  setEmail(demo.email);
                  setPassword("password123");
                  // Small delay to allow state to update before submit
                  setTimeout(() => {
                    const form = document.querySelector('form');
                    if (form) form.requestSubmit();
                  }, 50);
                }}
                className="flex flex-col items-start p-3 text-left rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--color-primary)] hover:bg-[var(--bg-surface-alt)] transition-all"
              >
                <span className="text-sm font-semibold text-[var(--text-primary)]">{demo.name}</span>
                <span className="text-xs text-[var(--text-secondary)]">{demo.role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
