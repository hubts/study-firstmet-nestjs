import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Validation Check
      forbidNonWhitelisted: true, // Force Validation Check (forbid request)
      transform: true // automatically, 'type' is transformed for Entity(Dto)
    })
  );
  await app.listen(3000);
}
bootstrap();
