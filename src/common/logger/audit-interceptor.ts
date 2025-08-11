// src/logger/audit.interceptor.ts
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable, tap } from 'rxjs';
  import { CustomLogger } from './custom-logger';
  
  @Injectable()
  export class AuditInterceptor implements NestInterceptor {
    constructor(private readonly logger: CustomLogger) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const ctx = context.switchToHttp();
      const req = ctx.getRequest();
      const res = ctx.getResponse();
  
      const { method, originalUrl, body, user } = req;
      const start = Date.now();
  
      return next.handle().pipe(
        tap((data) => {
          const duration = Date.now() - start;
  
          this.logger.saveToAuditLog(
            `${method} ${originalUrl}`, // action
            JSON.stringify(body),       // request
            JSON.stringify(data),       // response
            user?.id ?? 0,               // userId
            res.statusCode,              // status
            undefined,                        // error
            undefined                         // lineNumber
          );
  
          console.log(
            `[AUDIT] ${method} ${originalUrl} - ${res.statusCode} (${duration}ms)`
          );
        })
      );
    }
  }
  