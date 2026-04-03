import type MockAdapter from 'axios-mock-adapter';

import {
  resolveRouteOptions,
  shouldFail,
  wait,
  type RouteMockOptions,
} from './shared';

const BANNERS_ENDPOINT = '/student/home/banners';

const banners = [
  {
    id: 'banner-1',
    imageUrl:
      'https://www.viet.edu.in/admin-center/uploads/8fe78768d2c93d2efcdaf6c9d587c426.png',
    type: 'EVENT',
    redirectId: 'event-1',
  },
  {
    id: 'banner-2',
    imageUrl:
      'https://www.viet.edu.in/admin-center/uploads/e0498442cc236841f72b730f48381fcd.png',
    type: 'EVENT',
    redirectId: 'event-2',
  },
  {
    id: 'banner-3',
    imageUrl:
      'https://www.viet.edu.in/admin-center/uploads/1f791fe4ca4904b80feabe7e0928abb4.png',
    type: 'EVENT',
    redirectId: 'event-3',
  },
  {
    id: 'banner-4',
    imageUrl:
      'https://www.viet.edu.in/admin-center/uploads/78edda3ae083f26ba2234288e55fd816.png',
    type: 'EVENT',
    redirectId: 'event-4',
  },
  {
    id: 'banner-5',
    imageUrl:
      'https://www.viet.edu.in/admin-center/uploads/4af6cee7051b4fb578061c42188bde3e.jpg',
    type: 'EVENT',
    redirectId: 'event-5',
  },
  {
    id: 'banner-6',
    imageUrl:
      'https://www.viet.edu.in/admin-center/uploads/20533d78cfe02c0ebe8a734a17f5f156.jpg',
    type: 'EVENT',
    redirectId: 'event-6',
  },
  {
    id: 'banner-7',
    imageUrl:
      'https://www.viet.edu.in/admin-center/uploads/4fe920f39be764bfaefbd79a815742ed.jpg',
    type: 'EVENT',
    redirectId: 'event-7',
  },
  {
    id: 'banner-8',
    imageUrl:
      'https://www.viet.edu.in/admin-center/uploads/1382fb51720b84b3e68b07890f899571.png',
    type: 'EVENT',
    redirectId: 'event-8',
  },
  {
    id: 'banner-9',
    imageUrl:
      'https://www.viet.edu.in/admin-center/uploads/03673ece1185bb4fca89d4a2302506e4.png',
    type: 'EVENT',
    redirectId: 'event-9',
  },
  {
    id: 'banner-10',
    imageUrl:
      'https://www.viet.edu.in/admin-center/uploads/db3eb852c107f998ac9110e181ce1cbf.jpg',
    type: 'EVENT',
    redirectId: 'event-10',
  },
  {
    id: 'banner-11',
    imageUrl:
      'https://www.viet.edu.in/admin-center/uploads/5dbb0ae1d16c07aa4291a1eee27f5361.jpg',
    type: 'EVENT',
    redirectId: 'event-11',
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
