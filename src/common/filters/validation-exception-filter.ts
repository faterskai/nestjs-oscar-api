import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionResponse: any = exception.getResponse();
    const validationErrors = exceptionResponse['message'];

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: 400,
      message: 'Validation failed',
      errors: validationErrors.map((error: any) => ({
        field: error.property,
        errors: Object.values(error.constraints || {}),
      })),
    });
  }
}
