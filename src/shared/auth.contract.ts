export const AUTH_PATTERNS = {
  register: 'auth.register',
  login: 'auth.login',
  logout: 'auth.logout',
  refresh: 'auth.refresh',
  passwordReset: 'auth.password.reset',
} as const;

export type AuthPattern = (typeof AUTH_PATTERNS)[keyof typeof AUTH_PATTERNS];
