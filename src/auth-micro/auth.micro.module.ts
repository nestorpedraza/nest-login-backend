import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { AuthService } from '../auth/auth.service';
import { AuthMicroController } from './auth.micro.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SUPABASE_URL: Joi.string()
          .uri({ scheme: ['http', 'https'] })
          .required(),
        SUPABASE_ANON_KEY: Joi.string().min(20).required(),
        GOOGLE_REDIRECT_URL: Joi.string().required(),
        GOOGLE_SCOPES: Joi.string().optional(),
        PASSWORD_RESET_REDIRECT_URL: Joi.string().optional(),
        AUTH_MICRO_TCP_PORT: Joi.number().default(4001),
      }),
      validationOptions: { abortEarly: false },
    }),
  ],
  controllers: [AuthMicroController],
  providers: [AuthService],
})
export class AuthMicroModule {}
