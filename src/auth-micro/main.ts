import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthMicroModule } from './auth.micro.module.js';

async function bootstrap() {
  const port = Number(process.env.AUTH_MICRO_TCP_PORT ?? 4001);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthMicroModule,
    {
      transport: Transport.TCP,
      options: { port },
    },
  );
  await app.listen();

  console.log(`Auth microservice running on TCP ${port}`);
}
void bootstrap();
