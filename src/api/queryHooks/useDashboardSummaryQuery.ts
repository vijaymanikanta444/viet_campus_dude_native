import { useQuery } from '@tanstack/react-query';
import { apiGet } from '..';

import { type DashboardSummary } from '../../services/api';

const DASHBOARD_SUMMARY_ENDPOINT = '/student/home/summary';

export const EXAMPLE_DASHBOARD_SUMMARY_RESPONSE: DashboardSummary = {
  attendance: 82,
  pendingAssignments: 3,
  cgpa: 8.2,
  feesDue: 15000,
};

/**
 * GET /student/home/summary
 * Example response:
 * {
 *   "attendance": 82,
 *   "pendingAssignments": 3,
 *   "cgpa": 8.2,
 *   "feesDue": 15000
 * }
 */
const getDashboardSummary = async () => {
  const response = await apiGet<DashboardSummary>(DASHBOARD_SUMMARY_ENDPOINT);
  return response.data ?? EXAMPLE_DASHBOARD_SUMMARY_RESPONSE;
};

export const useDashboardSummaryQuery = () =>
  useQuery<DashboardSummary>({
    queryKey: ['dashboardSummary'],
    queryFn: getDashboardSummary,
  });
