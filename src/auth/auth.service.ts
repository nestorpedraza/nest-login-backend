import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private client: ReturnType<typeof createClient>;

  constructor() {
    const url = process.env.SUPABASE_URL as string;
    const key = process.env.SUPABASE_ANON_KEY as string;
    this.client = createClient(url, key);
  }

  async register(email: string, password: string) {
    const { data, error } = await this.client.auth.signUp({ email, password });
    if (error) {
      return { error: { message: error.message, status: error.status } };
    }
    return { data };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error: { message: error.message, status: error.status } };
    }
    return { data };
  }

  async googleUrl(redirectTo?: string, scopes?: string[]) {
    const resolvedRedirect = redirectTo ?? process.env.GOOGLE_REDIRECT_URL;
    const envScopes = process.env.GOOGLE_SCOPES;
    const resolvedScopes =
      scopes?.join(' ') ??
      (envScopes
        ? envScopes.includes(',')
          ? envScopes
              .split(',')
              .map((s) => s.trim())
              .join(' ')
          : envScopes
        : undefined);
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: resolvedRedirect,
        skipBrowserRedirect: true,
        scopes: resolvedScopes,
      },
    });
    if (error) {
      return { error: { message: error.message, status: error.status } };
    }
    return { data };
  }

  async exchangeCodeForSession(code: string) {
    const { data, error } = await this.client.auth.exchangeCodeForSession(code);
    if (error) {
      return { error: { message: error.message, status: error.status } };
    }
    return { data };
  }
}
