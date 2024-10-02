import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { EntityPropertyNotFoundError } from 'typeorm';

@Catch(EntityPropertyNotFoundError)
export class EntityPropertyErrorFilter implements ExceptionFilter {
  catch(exception: EntityPropertyNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
      error: exception.constructor.name,
      timestamp: new Date().toISOString(),
    });
  }
}
