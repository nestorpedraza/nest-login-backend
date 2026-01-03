import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module.js';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const port = Number(process.env.GATEWAY_PORT ?? 3001);
  const config = new DocumentBuilder()
    .setTitle('Gateway Auth API')
    .setDescription('Gateway HTTP para microservicio de autenticación')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(port);

  console.log(`Gateway running on http://localhost:${port}`);
}
void bootstrap();
