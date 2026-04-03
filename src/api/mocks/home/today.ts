import type MockAdapter from 'axios-mock-adapter';

import { resolveRouteOptions, shouldFail, wait, type RouteMockOptions } from './shared';

const TODAY_ENDPOINT = '/student/home/today';

const today = {
  classesToday: 3,
  assignmentsDue: 1,
};

export const registerTodayMock = (
  mock: MockAdapter,
  options?: RouteMockOptions,
) => {
  const route = resolveRouteOptions(options);

  if (!route.enabled) {
    return;
  }

  mock.onGet(TODAY_ENDPOINT).reply(async () => {
    await wait(route.delayMs);

    if (shouldFail(route.errorRate)) {
      return [500, { message: 'Mocked today summary failure' }];
    }

    return [route.statusCode, today];
  });
};
