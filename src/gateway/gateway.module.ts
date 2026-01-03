import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        AUTH_MICRO_TCP_PORT: Joi.number().default(4001),
        GATEWAY_PORT: Joi.number().default(3001),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_CLIENT',
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            port: Number(config.get('AUTH_MICRO_TCP_PORT') ?? 4001),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [GatewayController],
})
export class GatewayModule {}
