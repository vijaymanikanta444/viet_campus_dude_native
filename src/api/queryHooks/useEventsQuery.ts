import { useQuery } from '@tanstack/react-query';
import { apiGet } from '..';

import { type EventItem } from '../../services/api';

const EVENTS_ENDPOINT = '/student/home/events';

export const EXAMPLE_EVENTS_RESPONSE: EventItem[] = [
  {
    id: 'event-101',
    title: 'Hackathon 2026',
    dateLabel: 'Apr 18',
    venue: 'Main Auditorium',
  },
  {
    id: 'event-114',
    title: 'AI Workshop',
    dateLabel: 'Apr 22',
    venue: 'Seminar Hall - B',
  },
  {
    id: 'event-130',
    title: 'Sports Meet',
    dateLabel: 'Apr 29',
    venue: 'College Grounds',
  },
];

/**
 * GET /student/home/events
 * Example response:
 * [
 *   {
 *     "id": "event-101",
 *     "title": "Hackathon 2026",
 *     "dateLabel": "Apr 18",
 *     "venue": "Main Auditorium"
 *   }
 * ]
 */
const getEvents = async () => {
  const response = await apiGet<EventItem[]>(EVENTS_ENDPOINT);
  return response.data ?? EXAMPLE_EVENTS_RESPONSE;
};

export const useEventsQuery = () =>
  useQuery<EventItem[]>({
    queryKey: ['events'],
    queryFn: getEvents,
  });
