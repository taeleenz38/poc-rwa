import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true // Transform is recomended configuration for avoind issues with arrays of files transformations
    })
  );
  await app.listen(3000);
}
bootstrap();
