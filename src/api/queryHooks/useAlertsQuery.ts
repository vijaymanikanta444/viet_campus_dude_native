import { useQuery } from '@tanstack/react-query';
import { apiGet } from '..';

import { type AlertItem } from '../../services/api';

const ALERTS_ENDPOINT = '/student/home/alerts';

export const EXAMPLE_ALERTS_RESPONSE: AlertItem[] = [
  {
    id: 'alert-1',
    message: 'Attendance is below 75% in one subject.',
  },
  {
    id: 'alert-2',
    message: 'Mid exams start from 15th this month.',
  },
];

/**
 * GET /student/home/alerts
 * Example response:
 * [
 *   {
 *     "id": "alert-1",
 *     "message": "Attendance is below 75% in one subject."
 *   }
 * ]
 */
const getAlerts = async () => {
  const response = await apiGet<AlertItem[]>(ALERTS_ENDPOINT);
  return response.data ?? EXAMPLE_ALERTS_RESPONSE;
};

export const useAlertsQuery = () =>
  useQuery<AlertItem[]>({
    queryKey: ['alerts'],
    queryFn: getAlerts,
  });
