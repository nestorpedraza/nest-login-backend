import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { GoogleUrlDto } from './dto/google-url.dto.js';
import { RateLimitGuard } from '../common/rate-limit.guard.js';

@Controller('auth')
@UseGuards(RateLimitGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('google/url')
  async googleUrl(@Body() body: GoogleUrlDto) {
    return this.authService.googleUrl(body.redirectTo, body.scopes);
  }

  @Get('google/exchange')
  async googleExchange(@Query('code') code: string) {
    return this.authService.exchangeCodeForSession(code);
  }
}
