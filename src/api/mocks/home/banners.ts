import type MockAdapter from 'axios-mock-adapter';

import { resolveRouteOptions, shouldFail, wait, type RouteMockOptions } from './shared';

const BANNERS_ENDPOINT = '/student/home/banners';

const banners = [
  {
    id: 'banner-1',
    imageUrl:
      'https://images.unsplash.com/photo-1462539405390-d0bdb635c7d1?auto=format&fit=crop&w=1200&q=80',
    type: 'EVENT',
    redirectId: 'event-101',
  },
  {
    id: 'banner-2',
    imageUrl:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    type: 'ANNOUNCEMENT',
    redirectId: 'announcement-45',
  },
  {
    id: 'banner-3',
    imageUrl:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    type: 'EVENT',
    redirectId: 'event-114',
  },
];

export const registerBannersMock = (
  mock: MockAdapter,
  options?: RouteMockOptions,
) => {
  const route = resolveRouteOptions(options);

  if (!route.enabled) {
    return;
  }

  mock.onGet(BANNERS_ENDPOINT).reply(async () => {
    await wait(route.delayMs);

    if (shouldFail(route.errorRate)) {
      return [500, { message: 'Mocked banners failure' }];
    }

    return [route.statusCode, banners];
  });
};
