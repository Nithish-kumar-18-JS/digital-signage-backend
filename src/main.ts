// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3001', // frontend origin
    credentials: true, // if you’re using cookies
  });

  app.setGlobalPrefix('api');


  await app.listen(3000);
}
bootstrap();
