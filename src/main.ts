// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuditInterceptor } from './common/logger/audit-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true, // keep true if you use cookies/sessions
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // ✅ Global API prefix
  app.setGlobalPrefix('api');

  // ✅ Global interceptor & filters
  app.useGlobalInterceptors(app.get(AuditInterceptor));
  app.useGlobalFilters(new HttpExceptionFilter());

  // ✅ Use Render's PORT (not hardcoded 3000)
  const port = process.env.PORT || 3000;
  console.log(
    `🚀 Backend running on port ${port}, allowed origin: ${process.env.FRONTEND_URL}`,
  );
  await app.listen(port, '0.0.0.0');
}

bootstrap();
