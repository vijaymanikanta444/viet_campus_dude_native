import type MockAdapter from 'axios-mock-adapter';

import { resolveRouteOptions, shouldFail, wait, type RouteMockOptions } from './shared';

const EVENTS_ENDPOINT = '/student/home/events';

const events = [
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
  {
    id: 'event-148',
    title: 'Tech Talk: Product Careers',
    dateLabel: 'May 03',
    venue: 'Block A - AV Room',
  },
];

export const registerEventsMock = (
  mock: MockAdapter,
  options?: RouteMockOptions,
) => {
  const route = resolveRouteOptions(options);

  if (!route.enabled) {
    return;
  }

  mock.onGet(EVENTS_ENDPOINT).reply(async () => {
    await wait(route.delayMs);

    if (shouldFail(route.errorRate)) {
      return [500, { message: 'Mocked events failure' }];
    }

    return [route.statusCode, events];
  });
};
