// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuditInterceptor } from './common/logger/audit-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS

  console.log(process.env.FRONTEND_URL)

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(app.get(AuditInterceptor));
  app.useGlobalFilters(new HttpExceptionFilter());
  // enable global logging and store logging

  console.log('Listening on port 3000');
  await app.listen(3000);
}
bootstrap();
