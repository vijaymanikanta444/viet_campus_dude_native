import { Platform } from 'react-native';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { setupAxiosMockAdapter } from './mockAdapter';

// API Response wrapper type for consistent formatting
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  status: number;
  error?: string;
};

// Create axios instance with default config
const API_BASE_URL = 'https://api.yourdomain.com/api/v1'; // Update with your API endpoint
const mockToggle = (globalThis as typeof globalThis & {
  __ENABLE_API_MOCKS__?: boolean;
}).__ENABLE_API_MOCKS__;
const ENABLE_API_MOCKS = __DEV__ && (mockToggle ?? true);

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const buildRequestUrl = (config: AxiosRequestConfig) => {
  const baseURL = config.baseURL ?? '';
  const url = config.url ?? '';
  return `${baseURL}${url}`;
};

if (ENABLE_API_MOCKS) {
  setupAxiosMockAdapter(axiosInstance, {
    globalDelayMs: 0,
    passThroughUnmatched: true,
    home: {
      banners: { delayMs: 400 },
      summary: { delayMs: 500 },
      today: { delayMs: 450 },
      alerts: { delayMs: 600, errorRate: 0 },
      events: { delayMs: 650 },
    },
  });
}

// Request Interceptor - Add headers like auth token
axiosInstance.interceptors.request.use(
  config => {
    // Add any common headers here (e.g., authorization token)
    // Example: const token = getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // Add custom header example
    config.headers['X-Client'] = 'react-native-app';
    config.headers['X-App-Version'] = '1.0.0';
    config.headers['X-Source'] = 'mobile-app';
    config.headers['X-Platform'] = Platform.OS;

    if (__DEV__) {
      const method = (config.method ?? 'GET').toUpperCase();
      const requestUrl = buildRequestUrl(config);
      console.log(
        `[API:${ENABLE_API_MOCKS ? 'MOCK' : 'LIVE'}] ${method} ${requestUrl}`,
      );
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response Interceptor - Format all responses consistently
axiosInstance.interceptors.response.use(
  response => {
    if (__DEV__) {
      const method = (response.config.method ?? 'GET').toUpperCase();
      const requestUrl = buildRequestUrl(response.config);
      console.log(
        `[API:${ENABLE_API_MOCKS ? 'MOCK' : 'LIVE'}] ${response.status} ${method} ${requestUrl}`,
      );
    }

    // Transform successful response to standard format
    const apiResponse: ApiResponse = {
      success: true,
      data: response.data,
      message: 'Request successful',
      status: response.status,
    };
    return apiResponse as any;
  },
  error => {
    if (__DEV__) {
      const method = (error?.config?.method ?? 'GET').toUpperCase();
      const requestUrl = buildRequestUrl(error?.config ?? {});
      const status = error?.response?.status ?? 'ERR';
      console.log(
        `[API:${ENABLE_API_MOCKS ? 'MOCK' : 'LIVE'}] ${status} ${method} ${requestUrl}`,
      );
    }

    // Handle errors and format them consistently
    let errorMessage = 'An unknown error occurred';
    let status = 500;

    if (error.response) {
      // Server responded with error status
      status = error.response.status;
      errorMessage =
        error.response.data?.message ||
        error.response.statusText ||
        'Server error';
    } else if (error.request) {
      // Request was made but no response
      errorMessage = 'No response from server. Check your connection.';
      status = 0;
    } else if (error.message) {
      // Error in request setup
      errorMessage = error.message;
    }

    const apiResponse: ApiResponse = {
      success: false,
      message: errorMessage,
      status,
      error: errorMessage,
    };

    return Promise.reject(apiResponse);
  },
);

export default axiosInstance;
