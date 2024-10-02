import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  private extractValidationErrors(exception: BadRequestException) {
    const response = exception.getResponse() as any;

    // Check if this is a validation error response
    if (response.message && Array.isArray(response.message)) {
      return response.message;
    }
    return null;
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error(
      `Exception occurred: ${exception.message}`,
      exception.stack,
    );

    if (exception instanceof BadRequestException) {
      const validationErrors = this.extractValidationErrors(exception);
      if (validationErrors) {
        return res.status(status).json({
          statusCode: status,
          path: req.url,
          error: 'Bad Request',
          timestamp: new Date().toISOString(),
          message: validationErrors,
        });
      }
    }

    return res.status(status).json({
      statusCode: status,
      path: req.url,
      error: exception.constructor.name,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
