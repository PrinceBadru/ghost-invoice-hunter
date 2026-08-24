import React from 'react';
import styles from './dashboard.module.css';

interface Investigation {
  id: string;
  description: string;
  status: string;
  time: string;
}

interface RecentInvestigationsProps {
  investigations: Investigation[];
}

export function RecentInvestigations({ investigations }: RecentInvestigationsProps) {
  if (!investigations || investigations.length === 0) {
    return (
      <div className="card h-full">
        <h2 className="text-xl font-semibold mb-4">Recent Investigations</h2>
        <p className="text-slate-500 text-sm">No recent investigations found.</p>
      </div>
    );
  }

  return (
    <div className="card h-full">
      <h2 className="text-xl font-semibold mb-4">Recent Investigations</h2>
      
      <div className="flex flex-col gap-0">
        {investigations.map((inv) => (
          <div key={inv.id} className={styles.recentItem}>
            <div className={styles.recentItemDetails}>
              <a href={`/investigations/${inv.id}`} className={styles.recentItemId}>
                {inv.id}
              </a>
              <span className={styles.recentItemDesc}>{inv.description}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`badge ${
                inv.status === 'Resolved' ? 'badge-success' : 
                inv.status === 'Rejected' ? 'badge-error' : 'badge-neutral'
              }`}>
                {inv.status}
              </span>
              <span className={styles.recentItemTime}>{inv.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
