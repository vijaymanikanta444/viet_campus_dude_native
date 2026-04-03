import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Response wrapper type for consistent formatting
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  status: number;
  error?: string;
};

// Create axios instance with default config
const API_BASE_URL = 'https://api.example.com'; // Update with your API endpoint

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

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

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response Interceptor - Format all responses consistently
axiosInstance.interceptors.response.use(
  response => {
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
