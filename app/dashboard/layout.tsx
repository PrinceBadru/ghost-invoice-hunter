"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Only include navigation items that correspond to implemented functionality.
  // Do not add navigation items for features that do not exist yet.
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-[#0f172a] text-slate-100 border-r border-slate-800 transition-transform duration-300 md:translate-x-0 md:static md:flex-shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-24 border-b border-slate-800 flex-shrink-0">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight text-white flex items-center gap-8">
            <span className="text-xl">👻</span>
            <span>Ghost Invoice Hunter</span>
          </Link>
          <button
            type="button"
            className="p-8 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 md:hidden focus:outline-none"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-16 py-24 space-y-8 overflow-y-auto">
          <div className="space-y-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-12 px-12 py-8 rounded-md text-sm font-medium transition-colors
                    ${isActive
                      ? "bg-slate-800 text-white border border-slate-700"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent"}
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between h-16 px-24 bg-white border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-16">
            <button
              type="button"
              className="p-8 -ml-8 rounded-md text-slate-600 hover:bg-slate-100 md:hidden focus:outline-none"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <div className="text-sm font-medium text-slate-500">
              <span className="text-slate-400 mr-4 font-normal">Organization:</span>
              <span className="text-slate-800 font-semibold">Acme Corporation</span>
            </div>
          </div>
          <div className="flex items-center gap-16">
          </div>
        </header>

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto bg-slate-50 focus:outline-none p-24 md:p-32">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
