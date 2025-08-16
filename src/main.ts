import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuditInterceptor } from './common/logger/audit-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log("Allowed origin:", process.env.FRONTEND_URL);

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(app.get(AuditInterceptor));
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 3000;  // ✅ use Render’s port if available
  await app.listen(port, '0.0.0.0');      // ✅ listen on all interfaces
  console.log(`🚀 Backend running on port ${port}, allowed origin: ${process.env.FRONTEND_URL}`);
}
bootstrap();
