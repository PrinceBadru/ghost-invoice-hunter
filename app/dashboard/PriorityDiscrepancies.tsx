import React from 'react';
import styles from './dashboard.module.css';

interface Discrepancy {
  id: string;
  type: string;
  impact: number;
  status: string;
}

interface PriorityDiscrepanciesProps {
  discrepancies: Discrepancy[];
}

export function PriorityDiscrepancies({ discrepancies }: PriorityDiscrepanciesProps) {
  if (!discrepancies || discrepancies.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">High Priority Discrepancies</h2>
        <p className="text-slate-500">No high priority discrepancies at this time.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold p-0 m-0">High Priority Discrepancies</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Type</th>
              <th className="numeric">Financial Impact</th>
              <th className="status">Status</th>
              <th className="actions">Action</th>
            </tr>
          </thead>
          <tbody>
            {discrepancies.map((d) => (
              <tr key={d.id} className={styles.tableRow}>
                <td className="font-medium">{d.id}</td>
                <td>{d.type}</td>
                <td className="numeric font-medium text-slate-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(d.impact)}
                </td>
                <td className="status">
                  <span className={`badge ${d.status === 'High' ? 'badge-error' : 'badge-warning'}`}>
                    {d.status}
                  </span>
                </td>
                <td className="actions">
                  <a href={`/discrepancies/${d.id}`} className={styles.tableAction}>
                    Investigate
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-center">
        <a href="/discrepancies" className="text-sm font-medium text-slate-500 hover:text-slate-900">
          View All Discrepancies
        </a>
      </div>
    </div>
  );
}
