import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: Number(process.env.PORT) || 3004,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();

  await app.startAllMicroservices();
  await app.listen(Number(process.env.PORT) || 3004);
  logger.log(`Files MS corriendo en puerto ${process.env.PORT || 3004}`);
}
bootstrap().catch((err) => {
  console.error('Error starting application:', err);
  process.exit(1);
});
