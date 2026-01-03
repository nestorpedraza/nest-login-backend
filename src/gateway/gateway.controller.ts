import { Controller, Post, Body, Req, Query } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AUTH_PATTERNS } from '../shared/auth.contract.js';
import { LoginDto } from '../auth/dto/login.dto.js';
import { RefreshDto } from '../auth/dto/refresh.dto.js';
import { ResetPasswordDto } from '../auth/dto/reset-password.dto.js';
import type { Request } from 'express';
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('g/auth')
@ApiTags('auth')
export class GatewayController {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
  ) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Sesión iniciada o error' })
  async login(@Body() body: LoginDto): Promise<unknown> {
    const obs = this.authClient.send<
      unknown,
      { email: string; password: string }
    >(AUTH_PATTERNS.login, {
      email: body.email,
      password: body.password,
    });
    return await lastValueFrom(obs);
  }

  @Post('refresh')
  @ApiBody({ type: RefreshDto })
  @ApiOkResponse({ description: 'Sesión refrescada o error' })
  async refresh(@Body() body: RefreshDto): Promise<unknown> {
    const obs = this.authClient.send<unknown, { refreshToken: string }>(
      AUTH_PATTERNS.refresh,
      {
        refreshToken: body.refresh_token,
      },
    );
    return await lastValueFrom(obs);
  }

  @Post('password/reset')
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({ description: 'Email de recuperación enviado' })
  async resetPassword(@Body() body: ResetPasswordDto): Promise<unknown> {
    const obs = this.authClient.send<
      unknown,
      { email: string; redirectTo?: string }
    >(AUTH_PATTERNS.passwordReset, {
      email: body.email,
      redirectTo: body.redirectTo,
    });
    return await lastValueFrom(obs);
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
    @Req() req: Request,
    @Query('scope') scope?: 'global' | 'local' | 'others',
  ): Promise<unknown> {
    const authorization = req.headers['authorization'];
    const token =
      authorization && authorization.startsWith('Bearer ')
        ? authorization.slice(7)
        : undefined;
    const obs = this.authClient.send<
      unknown,
      { accessToken: string; scope?: 'global' | 'local' | 'others' }
    >(AUTH_PATTERNS.logout, { accessToken: token ?? '', scope });
    return await lastValueFrom(obs);
  }
}
