"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, AlertOctagon, ShoppingCart, Quote, Users, Building2, BarChart3, History, Settings } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();

  const navGroups = [
    {
      title: "OVERVIEW",
      items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }]
    },
    {
      title: "WORK",
      items: [
        { label: "Invoices", href: "/invoices", icon: FileText },
        { label: "Discrepancies", href: "/discrepancies", icon: AlertOctagon },
        { label: "Purchase Orders", href: "/purchase-orders", icon: ShoppingCart },
        { label: "Quotes", href: "/quotes", icon: Quote }
      ]
    },
    {
      title: "MANAGEMENT",
      items: [
        { label: "Vendors", href: "/vendors", icon: Building2 },
        { label: "Team", href: "/team", icon: Users }
      ]
    },
    {
      title: "REPORTING",
      items: [
        { label: "Reports", href: "/reports", icon: BarChart3 },
        { label: "Audit Log", href: "/audit-log", icon: History }
      ]
    },
    {
      title: "SYSTEM",
      items: [{ label: "Settings", href: "/settings", icon: Settings }]
    }
  ];

  return (
    <aside className="w-64 border-r border-[var(--border-color)] bg-[var(--bg-surface)] min-h-screen p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Brand */}
        <div className="px-3 py-2">
          <div className="font-display font-bold text-base tracking-tight text-[var(--text-primary)]">
            GHOST INVOICE
          </div>
          <div className="text-[11px] font-mono uppercase text-[var(--text-muted)] tracking-widest">
            Hunter v1.0
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="space-y-4">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-semibold text-[var(--text-muted)] tracking-wider uppercase">
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)]"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-3 border-t border-[var(--border-color)] text-[11px] text-[var(--text-muted)] font-mono">
        Status: <span className="text-[var(--success)]">● Operational</span>
      </div>
    </aside>
  );
};