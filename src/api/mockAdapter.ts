import MockAdapter from 'axios-mock-adapter';
import type { AxiosInstance } from 'axios';
import {
  registerAlertsMock,
  registerBannersMock,
  registerEventsMock,
  registerSummaryMock,
  registerTodayMock,
  type RouteMockOptions,
} from './mocks/home';

let isInitialized = false;

type HomeMockOptions = {
  banners?: RouteMockOptions;
  summary?: RouteMockOptions;
  today?: RouteMockOptions;
  alerts?: RouteMockOptions;
  events?: RouteMockOptions;
};

export type AxiosMockAdapterOptions = {
  globalDelayMs?: number;
  passThroughUnmatched?: boolean;
  home?: HomeMockOptions;
};

export const setupAxiosMockAdapter = (
  instance: AxiosInstance,
  options?: AxiosMockAdapterOptions,
) => {
  if (isInitialized) {
    return;
  }

  const resolvedOptions: Required<
    Pick<AxiosMockAdapterOptions, 'globalDelayMs' | 'passThroughUnmatched'>
  > &
    Pick<AxiosMockAdapterOptions, 'home'> = {
    globalDelayMs: options?.globalDelayMs ?? 0,
    passThroughUnmatched: options?.passThroughUnmatched ?? true,
    home: options?.home,
  };

  const mock = new MockAdapter(instance, {
    delayResponse: resolvedOptions.globalDelayMs,
  });

  registerBannersMock(mock, resolvedOptions.home?.banners);
  registerSummaryMock(mock, resolvedOptions.home?.summary);
  registerTodayMock(mock, resolvedOptions.home?.today);
  registerAlertsMock(mock, resolvedOptions.home?.alerts);
  registerEventsMock(mock, resolvedOptions.home?.events);

  // Keep unmatched requests visible during development.
  if (resolvedOptions.passThroughUnmatched) {
    mock.onAny().passThrough();
  }

  isInitialized = true;
};
