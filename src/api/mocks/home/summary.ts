import type MockAdapter from 'axios-mock-adapter';

import { resolveRouteOptions, shouldFail, wait, type RouteMockOptions } from './shared';

const SUMMARY_ENDPOINT = '/student/home/summary';

const summary = {
  attendance: 86,
  pendingAssignments: 2,
  cgpa: 8.6,
  feesDue: 12000,
};

export const registerSummaryMock = (
  mock: MockAdapter,
  options?: RouteMockOptions,
) => {
  const route = resolveRouteOptions(options);

  if (!route.enabled) {
    return;
  }

  mock.onGet(SUMMARY_ENDPOINT).reply(async () => {
    await wait(route.delayMs);

    if (shouldFail(route.errorRate)) {
      return [500, { message: 'Mocked summary failure' }];
    }

    return [route.statusCode, summary];
  });
};
