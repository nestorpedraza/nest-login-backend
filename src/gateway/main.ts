import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const port = Number(process.env.GATEWAY_PORT ?? 3001);
  await app.listen(port);

  console.log(`Gateway running on http://localhost:${port}`);
}
void bootstrap();
