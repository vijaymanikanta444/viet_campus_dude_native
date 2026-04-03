export type AuthSession = {
  token: string;
  email: string | null;
  isAuthenticated: true;
};

const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<AuthSession> {
  await delay(500);

  return {
    token: `viet-${Date.now()}-${email.length + password.length}`,
    email,
    isAuthenticated: true,
  };
}

export async function loginWithSSO(): Promise<AuthSession> {
  throw new Error('SSO login is not implemented yet.');
}
