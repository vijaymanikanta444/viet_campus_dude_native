export type UserProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  branch: string;
  year: number;
};

export type AuthSession = {
  token: string;
  email: string | null;
  profile: UserProfile | null;
  isAuthenticated: true;
};

const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<AuthSession> {
  await delay(500);

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
    : 'User';

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
}

export async function loginWithSSO(): Promise<AuthSession> {
  throw new Error('SSO login is not implemented yet.');
}
