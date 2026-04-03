import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      gcTime: 1000 * 60 * 10, // Keep cache for 10 minutes
      retry: 1, // Retry failed requests once
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false, // Don't refetch when app comes to foreground
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
});
