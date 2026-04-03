export type RouteMockOptions = {
  enabled?: boolean;
  delayMs?: number;
  statusCode?: number;
  errorRate?: number;
};

export const DEFAULT_ROUTE_OPTIONS: Required<RouteMockOptions> = {
  enabled: true,
  delayMs: 600,
  statusCode: 200,
  errorRate: 0,
};

export const resolveRouteOptions = (
  options?: RouteMockOptions,
): Required<RouteMockOptions> => ({
  ...DEFAULT_ROUTE_OPTIONS,
  ...options,
});

export const wait = async (ms: number) => {
  if (ms <= 0) {
    return;
  }

  await new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
};

export const shouldFail = (errorRate: number) => {
  if (errorRate <= 0) {
    return false;
  }

  return Math.random() < errorRate;
};
