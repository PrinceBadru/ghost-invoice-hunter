import React from 'react';
import styles from './dashboard.module.css';

interface TrendDataPoint {
  period: string;
  amount: number;
}

interface FinancialOverviewProps {
  trendData: TrendDataPoint[];
}

export function FinancialOverview({ trendData }: FinancialOverviewProps) {
  const maxAmount = Math.max(...trendData.map(d => d.amount));
  
  if (!trendData || trendData.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
        <p className="text-slate-500">Not enough data to display a trend yet. Continue processing invoices to see financial trends here.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Revenue at Risk Over Time</h2>
      <div className={styles.chartContainer}>
        {trendData.map((point, idx) => {
          const heightPercent = (point.amount / maxAmount) * 100;
          return (
            <div 
              key={idx} 
              className={styles.chartBar} 
              style={{ height: `${heightPercent}%` }}
            >
              <div className={styles.chartTooltip}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(point.amount)}
              </div>
              <span className={styles.chartLabel}>{point.period}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-10 text-xs text-slate-400 text-center">Past 4 Weeks</div>
    </div>
  );
}
