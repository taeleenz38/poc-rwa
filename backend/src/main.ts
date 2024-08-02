import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://poc-rwa.vercel.app', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, 
    }),
  );

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}

bootstrap();
