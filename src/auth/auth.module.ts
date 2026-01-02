import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { RateLimitGuard } from '../common/rate-limit.guard.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RateLimitGuard],
})
export class AuthModule {}
