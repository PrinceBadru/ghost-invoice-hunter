"use client";

import React, { useState, useEffect } from "react";
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
  Menu,
  X,
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
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile Top Nav */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--bg-surface)] z-30">
        <div className="flex items-center gap-2">
          <Ghost className="w-5 h-5 text-[var(--color-primary)]" />
          <span className="font-display font-bold text-sm text-[var(--text-primary)]">
            Ghost Invoice Hunter
          </span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-1.5 -mr-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-surface-alt)] rounded-md"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--bg-surface)] flex flex-col border-r border-[var(--border-color)] transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Ghost className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="font-display font-bold text-sm text-[var(--text-primary)] hidden md:inline-block">
                Ghost Invoice
              </span>
              <span className="font-display font-bold text-sm text-[var(--text-primary)] md:hidden">
                Menu
              </span>
            </div>
            <p className="text-[10px] font-mono text-[var(--text-muted)] mt-1 truncate max-w-[180px]">
              {environmentName}
            </p>
          </div>
          <button 
            className="md:hidden p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-surface-alt)] rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm md:text-xs font-medium transition-colors ${
                  active
                    ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-alt)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 md:p-3 border-t border-[var(--border-color)] space-y-3 md:space-y-2">
          <div className="px-2">
            <div className="text-sm md:text-xs font-semibold text-[var(--text-primary)] truncate">
              {userName}
            </div>
            <div className="text-xs md:text-[10px] font-mono text-[var(--text-muted)] truncate">
              {userRole}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm md:text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-alt)] hover:text-[var(--danger)] transition-colors"
          >
            <LogOut className="w-4 h-4 md:w-3.5 md:h-3.5 shrink-0" /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}
