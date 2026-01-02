import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        SUPABASE_URL: Joi.string()
          .uri({ scheme: ['http', 'https'] })
          .required(),
        SUPABASE_ANON_KEY: Joi.string().min(20).required(),
        GOOGLE_REDIRECT_URL: Joi.string().required(),
        GOOGLE_SCOPES: Joi.string().optional(),
        RATE_LIMIT_WINDOW_MS: Joi.number().default(60000),
        RATE_LIMIT_MAX: Joi.number().default(60),
      }),
      validationOptions: { abortEarly: false },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
