import { Body, Controller, Get, Post, Query, UseGuards, Headers } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { GoogleUrlDto } from './dto/google-url.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';
import { RateLimitGuard } from '../common/rate-limit.guard.js';
import { ApiTags, ApiBody, ApiOkResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
@UseGuards(RateLimitGuard)
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ description: 'Usuario creado o error' })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Sesión iniciada o error' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('google/url')
  @ApiBody({ type: GoogleUrlDto })
  @ApiOkResponse({ description: 'URL de OAuth generada o error' })
  async googleUrl(@Body() body: GoogleUrlDto) {
    return this.authService.googleUrl(body.redirectTo, body.scopes);
  }

  @Get('google/exchange')
  @ApiQuery({ name: 'code', required: true })
  @ApiOkResponse({ description: 'Sesión obtenida o error' })
  async googleExchange(@Query('code') code: string) {
    return this.authService.exchangeCodeForSession(code);
  }

  @Post('refresh')
  @ApiBody({ type: RefreshDto })
  @ApiOkResponse({ description: 'Sesión refrescada o error' })
  async refresh(@Body() body: RefreshDto) {
    return this.authService.refresh(body.refresh_token);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'scope',
    required: false,
    enum: ['global', 'local', 'others'],
  })
  @ApiOkResponse({ description: 'Sesión cerrada' })
  async logout(
    @Headers('authorization') authorization?: string,
    @Query('scope') scope?: 'global' | 'local' | 'others',
  ) {
    let token: string | undefined;
    if (!token && authorization) {
      const parts = authorization.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        token = parts[1];
      }
    }
    return this.authService.logout(token ?? '', scope ?? 'global');
  }
}
