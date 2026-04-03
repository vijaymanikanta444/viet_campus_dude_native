export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginFormErrors = {
  email?: string;
  password?: string;
};

const VIET_EMAIL_DOMAIN = '@viet.edu.in';

export function validateEmail(email: string): string | null {
  const value = email.trim();

  if (!value) {
    return 'Email is required.';
  }

  if (!value.endsWith(VIET_EMAIL_DOMAIN)) {
    return 'Email must end with @viet.edu.in.';
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password.trim()) {
    return 'Password is required.';
  }

  return null;
}

export function validateLoginForm(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};

  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(values.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}
