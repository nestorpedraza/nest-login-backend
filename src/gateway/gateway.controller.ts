import { Controller, Post, Body } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AUTH_PATTERNS } from '../shared/auth.contract.js';
import { LoginDto } from '../auth/dto/login.dto.js';

@Controller('g/auth')
export class GatewayController {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
  ) {}

  @Post('login')
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
}
