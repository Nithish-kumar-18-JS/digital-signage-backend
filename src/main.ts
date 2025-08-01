// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS

  console.log(process.env.FRONTEND_URL)

  app.enableCors({
    origin: 'http://localhost:3001', // frontend origin
    credentials: true, // if you’re using cookies
  });

  app.setGlobalPrefix('api');

  console.log('Listening on port 3000');
  await app.listen(3000);
}
bootstrap();
