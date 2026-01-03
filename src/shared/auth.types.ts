export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type EmailPayload = {
  email: string;
  redirectTo?: string;
};
