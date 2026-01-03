import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private client?: ReturnType<typeof createClient>;
  constructor(private readonly config: ConfigService) {
    // lazy init
  }
  private getClient() {
    if (!this.client) {
      const url = this.config.get<string>('SUPABASE_URL') as string;
      const key = this.config.get<string>('SUPABASE_ANON_KEY') as string;
      this.client = createClient(url, key);
    }
    return this.client;
  }

  async register(email: string, password: string) {
    const { data, error } = await this.getClient().auth.signUp({
      email,
      password,
    });
    if (error) {
      return { error: { message: error.message, status: error.status } };
    }
    return { data };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.getClient().auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error: { message: error.message, status: error.status } };
    }
    return { data };
  }

  async googleUrl(redirectTo?: string, scopes?: string[]) {
    const resolvedRedirect =
      redirectTo ?? this.config.get<string>('GOOGLE_REDIRECT_URL');
    const envScopes = this.config.get<string>('GOOGLE_SCOPES');
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
    const { data, error } = await this.getClient().auth.signInWithOAuth({
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
    const { data, error } =
      await this.getClient().auth.exchangeCodeForSession(code);
    if (error) {
      return { error: { message: error.message, status: error.status } };
    }
    return { data };
  }

  async refresh(refresh_token: string) {
    const { data, error } = await this.getClient().auth.refreshSession({
      refresh_token,
    });
    if (error) {
      return { error: { message: error.message, status: error.status } };
    }
    return { data };
  }

  async logout(
    access_token: string,
    scope: 'global' | 'local' | 'others' = 'global',
  ) {
    const { error } = await this.getClient().auth.admin.signOut(
      access_token,
      scope,
    );
    if (error) {
      return { error: { message: error.message, status: error.status } };
    }
    return { data: null };
  }

  async resetPassword(email: string, redirectTo?: string) {
    const redirect =
      redirectTo ?? this.config.get<string>('PASSWORD_RESET_REDIRECT_URL');
    const { data, error } = await this.getClient().auth.resetPasswordForEmail(
      email,
      { redirectTo: redirect },
    );
    if (error) {
      return { error: { message: error.message, status: error.status } };
    }
    return { data };
  }
}
