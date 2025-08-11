// src/logger/custom-logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CustomLogger implements LoggerService {
  constructor(private readonly prisma: PrismaService) {}

  log(message: string, context?: string) {
    console.log(message, context || '');
  }

  error(message: string, trace?: string, context?: string) {
    console.error(message, trace || '', context || '');
  }

  warn(message: string, context?: string) {
    console.warn(message, context || '');
  }

  debug(message: string, context?: string) {
    console.debug(message, context || '');
  }

  verbose(message: string, context?: string) {
    console.info(message, context || '');
  }

  async saveToAuditLog(
    action: string,
    request: string,
    response: string,
    userId?: number,
    status?: number,
    error?: string,
    lineNumber?: number
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: userId ?? 0,
          action,
          request,
          response,
          error: error || null,
          status: status ?? 200,
          lineNumber,
        },
      });
    } catch (err) {
      console.error('Failed to save audit log:', err);
    }
  }
}
