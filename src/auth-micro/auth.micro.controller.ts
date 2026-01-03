import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../auth/auth.service.js';
import { AUTH_PATTERNS } from '../shared/auth.contract.js';
import type { EmailPayload } from '../shared/auth.types.js';

@Controller()
export class AuthMicroController {
  constructor(private readonly auth: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.register)
  async register(@Payload() payload: { email: string; password: string }) {
    return this.auth.register(payload.email, payload.password);
  }

  @MessagePattern(AUTH_PATTERNS.login)
  async login(@Payload() payload: { email: string; password: string }) {
    return this.auth.login(payload.email, payload.password);
  }

  @MessagePattern(AUTH_PATTERNS.logout)
  async logout(
    @Payload()
    payload: {
      accessToken: string;
      scope?: 'global' | 'local' | 'others';
    },
  ) {
    return this.auth.logout(payload.accessToken, payload.scope ?? 'global');
  }

  @MessagePattern(AUTH_PATTERNS.refresh)
  async refresh(@Payload() payload: { refreshToken: string }) {
    return this.auth.refresh(payload.refreshToken);
  }

  @MessagePattern(AUTH_PATTERNS.passwordReset)
  async passwordReset(@Payload() payload: EmailPayload) {
    return this.auth.resetPassword(payload.email, payload.redirectTo);
  }
}
