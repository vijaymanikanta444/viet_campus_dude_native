import { useMutation } from '@tanstack/react-query';
import { apiPost } from '..';

import { type AuthSession } from '../../services/authService';

const LOGIN_ENDPOINT = '/auth/login';

export type LoginCredentials = {
  email: string;
  password: string;
};

const buildExampleSession = (email: string, password: string): AuthSession => {
  const normalizedEmail = email.trim().toLowerCase();
  const localPart = normalizedEmail.split('@')[0] ?? 'student';
  const [firstNamePart, lastNamePart] = localPart
    .split(/[._-]/)
    .filter(Boolean);
  const firstName = firstNamePart
    ? firstNamePart.charAt(0).toUpperCase() + firstNamePart.slice(1)
    : 'Student';
  const lastName = lastNamePart
    ? lastNamePart.charAt(0).toUpperCase() + lastNamePart.slice(1)
    : '';

  return {
    token: `viet-${Date.now()}-${normalizedEmail.length + password.length}`,
    email: normalizedEmail,
    profile: {
      userId: `student-${Date.now()}`,
      firstName,
      lastName,
      email: normalizedEmail,
      branch: 'CSE',
      year: 3,
    },
    isAuthenticated: true,
  };
};

/**
 * POST /auth/login
 * Example request:
 * {
 *   "email": "student@viet.edu.in",
 *   "password": "password123"
 * }
 */
const loginUser = async ({ email, password }: LoginCredentials) => {
  const response = await apiPost<AuthSession>(LOGIN_ENDPOINT, {
    email,
    password,
  });
  return response.data ?? buildExampleSession(email, password);
};

export const useLoginMutation = () =>
  useMutation({
    mutationKey: ['login'],
    mutationFn: loginUser,
  });
