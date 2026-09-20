"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Quote,
  AlertTriangle,
  Building2,
  BarChart3,
  Users,
  History,
  Settings,
  Upload,
  LogOut,
  Ghost,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Command Center", icon: LayoutDashboard },
  { href: "/upload", label: "Process Invoices", icon: Upload },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/purchase-orders", label: "Purchase Orders", icon: ShoppingCart },
  { href: "/quotes", label: "Quotes", icon: Quote },
  { href: "/discrepancies", label: "Discrepancies", icon: AlertTriangle },
  { href: "/vendors", label: "Vendors", icon: Building2 },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/team", label: "Team", icon: Users },
  { href: "/audit-log", label: "Audit Log", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  environmentName,
  userName,
  userRole,
}: {
  environmentName: string;
  userName: string;
  userRole: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-64 shrink-0 border-r border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col">
      <div className="p-5 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <Ghost className="w-5 h-5 text-[var(--color-primary)]" />
          <span className="font-display font-bold text-sm text-[var(--text-primary)]">
            Ghost Invoice Hunter
          </span>
        </div>
        <p className="text-[10px] font-mono text-[var(--text-muted)] mt-1 truncate">
          {environmentName}
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                active
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-alt)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--border-color)] space-y-2">
        <div className="px-2">
          <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
            {userName}
          </div>
          <div className="text-[10px] font-mono text-[var(--text-muted)]">
            {userRole}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-alt)] hover:text-[var(--danger)] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Log out
        </button>
      </div>
    </aside>
  );
}
