import React from 'react';

export function DashboardHeader() {
  return (
    <div className="mb-24">
      <p className="text-sm text-neutral-500 font-medium mb-1">Organization: Acme Corporation</p>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 m-0 p-0">Dashboard</h1>
          <p className="text-slate-500 mt-2">Overview of your organization&apos;s reconciliation activity</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-secondary">View Reports</button>
          <button className="btn btn-primary">+ Add Invoice</button>
        </div>
      </div>
    </div>
  );
}
