import type MockAdapter from 'axios-mock-adapter';

import { resolveRouteOptions, shouldFail, wait, type RouteMockOptions } from './shared';

const ALERTS_ENDPOINT = '/student/home/alerts';

const alerts = [
  {
    id: 'alert-1',
    message: 'Internal exam timetable published for CSE 3rd year.',
  },
  {
    id: 'alert-2',
    message: 'Lab record submission deadline is tomorrow 5:00 PM.',
  },
  {
    id: 'alert-3',
    message: 'Your attendance is below 75% in Operating Systems.',
  },
];

export const registerAlertsMock = (
  mock: MockAdapter,
  options?: RouteMockOptions,
) => {
  const route = resolveRouteOptions(options);

  if (!route.enabled) {
    return;
  }

  mock.onGet(ALERTS_ENDPOINT).reply(async () => {
    await wait(route.delayMs);

    if (shouldFail(route.errorRate)) {
      return [500, { message: 'Mocked alerts failure' }];
    }

    return [route.statusCode, alerts];
  });
};
