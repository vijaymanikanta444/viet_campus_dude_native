import { apiGet, apiPost } from './index';

/**
 * Example API service - Replace with your actual endpoints
 * This demonstrates how to create typed API calls using the axios setup
 */

// Example response types
export type User = {
  id: string;
  name: string;
  email: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

/**
 * Get user profile - Example GET request
 */
export const getUserProfile = async (userId: string) => {
  return apiGet<User>(`/users/${userId}`);
};

/**
 * Login user - Example POST request
 */
export const loginUser = async (credentials: LoginRequest) => {
  return apiPost<LoginResponse>('/auth/login', credentials);
};

/**
 * Get list of users - Example GET with query params
 */
export const getUsers = async (page: number = 1, limit: number = 10) => {
  return apiGet<User[]>('/users', {
    params: {
      page,
      limit,
    },
  });
};

// Add more API endpoints following this pattern...
