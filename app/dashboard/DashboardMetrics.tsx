import React from 'react';
import styles from './dashboard.module.css';

interface DashboardMetricsProps {
  data: {
    revenueAtRisk: { amount: number; currency: string; trend: string };
    openIssues: { count: number; highPriority: number };
    recoverable: { amount: number; percentage: number };
    invoicesAnalyzed: { count: number; period: string };
  };
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export function DashboardMetrics({ data }: DashboardMetricsProps) {
  return (
    <div className={styles.metricsGrid}>
      <div className={`${styles.card} ${styles.metricCard}`}>
        <div className={styles.metricLabel}>Revenue at Risk</div>
        <div className={styles.metricValue}>{formatCurrency(data.revenueAtRisk.amount, data.revenueAtRisk.currency)}</div>
        <div className={styles.metricSubtext}>
          <span className={styles.trendPositive}>{data.revenueAtRisk.trend}</span> from previous period
        </div>
      </div>
      
      <div className={`${styles.card} ${styles.metricCard}`}>
        <div className={styles.metricLabel}>Open Issues</div>
        <div className={styles.metricValue}>{data.openIssues.count}</div>
        <div className={styles.metricSubtext}>
          <span className="badge badge-error">{data.openIssues.highPriority} High Priority</span>
        </div>
      </div>

      <div className={`${styles.card} ${styles.metricCard}`}>
        <div className={styles.metricLabel}>Recoverable</div>
        <div className={styles.metricValue}>{formatCurrency(data.recoverable.amount, 'USD')}</div>
        <div className={styles.metricSubtext}>
          {data.recoverable.percentage}% of risk
        </div>
      </div>

      <div className={`${styles.card} ${styles.metricCard}`}>
        <div className={styles.metricLabel}>Invoices Analyzed</div>
        <div className={styles.metricValue}>{data.invoicesAnalyzed.count.toLocaleString()}</div>
        <div className={styles.metricSubtext}>
          {data.invoicesAnalyzed.period}
        </div>
      </div>
    </div>
  );
}
