"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

export function AddUserForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("UPLOADER");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    setLoading(false);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error ?? "Could not add user");
      return;
    }
    setName("");
    setEmail("");
    setPassword("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
      >
        <UserPlus className="w-3.5 h-3.5" /> Add user
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-3 max-w-md"
    >
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-alt)]"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-alt)]"
        >
          <option value="ADMIN">Admin</option>
          <option value="UPLOADER">Uploader</option>
          <option value="VIEWER">Viewer</option>
        </select>
      </div>
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-1.5 text-xs rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-alt)]"
      />
      <input
        type="password"
        placeholder="Temporary password"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-1.5 text-xs rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-alt)]"
      />
      {error && <p className="text-[11px] text-[var(--danger)]">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add user"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-3 py-1.5 text-xs rounded-md border border-[var(--border-color)] text-[var(--text-secondary)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
