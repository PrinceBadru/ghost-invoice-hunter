import React from 'react';
import styles from './dashboard.module.css';
import { DashboardHeader } from './DashboardHeader';
import { DashboardMetrics } from './DashboardMetrics';
import { FinancialOverview } from './FinancialOverview';
import { PriorityDiscrepancies } from './PriorityDiscrepancies';
import { RecentInvestigations } from './RecentInvestigations';

// Mock Data as per MVP requirements
const MOCK_DATA = {
  revenueAtRisk: { amount: 384720, currency: 'USD', trend: '+8.4%' },
  openIssues: { count: 247, highPriority: 32 },
  recoverable: { amount: 142350, percentage: 37 },
  invoicesAnalyzed: { count: 12842, period: 'This month' },
  trendData: [
    { period: 'Week 1', amount: 310000 },
    { period: 'Week 2', amount: 384000 },
    { period: 'Week 3', amount: 320000 },
    { period: 'Week 4', amount: 384720 },
  ],
  priorityDiscrepancies: [
    { id: 'INV-1024', type: 'Price mismatch', impact: 12500, status: 'High' },
    { id: 'INV-1041', type: 'Duplicate', impact: 8200, status: 'High' },
    { id: 'INV-1055', type: 'PO mismatch', impact: 6400, status: 'High' },
  ],
  recentInvestigations: [
    { id: 'INV-1024', description: 'Price mismatch', status: 'Resolved', time: '2 hours ago' },
    { id: 'INV-1031', description: 'Duplicate invoice', status: 'Rejected', time: '5 hours ago' },
    { id: 'INV-1042', description: 'Partial payment', status: 'Under Review', time: 'Yesterday' },
  ]
};

export default function DashboardPage() {
  return (
    <div className={styles.dashboardContainer}>
      <DashboardHeader />
      
      <DashboardMetrics data={{
        revenueAtRisk: MOCK_DATA.revenueAtRisk,
        openIssues: MOCK_DATA.openIssues,
        recoverable: MOCK_DATA.recoverable,
        invoicesAnalyzed: MOCK_DATA.invoicesAnalyzed
      }} />
      
      <FinancialOverview trendData={MOCK_DATA.trendData} />
      
      <div className={styles.twoColumnGrid}>
        <PriorityDiscrepancies discrepancies={MOCK_DATA.priorityDiscrepancies} />
        <RecentInvestigations investigations={MOCK_DATA.recentInvestigations} />
      </div>
    </div>
  );
}
