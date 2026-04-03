import { useQuery } from '@tanstack/react-query';
import { apiGet } from '..';

import { type TodaySummary } from '../../services/api';

const TODAY_SUMMARY_ENDPOINT = '/student/home/today';

export const EXAMPLE_TODAY_SUMMARY_RESPONSE: TodaySummary = {
  classesToday: 2,
  assignmentsDue: 1,
};

/**
 * GET /student/home/today
 * Example response:
 * {
 *   "classesToday": 2,
 *   "assignmentsDue": 1
 * }
 */
const getTodaySummary = async () => {
  const response = await apiGet<TodaySummary>(TODAY_SUMMARY_ENDPOINT);
  return response?.data ?? EXAMPLE_TODAY_SUMMARY_RESPONSE;
};

export const useTodaySummaryQuery = () =>
  useQuery<TodaySummary>({
    queryKey: ['todaySummary'],
    queryFn: getTodaySummary,
  });
