import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { LogService } from '../../modules/logs/logs.service';

@Catch()
export class LoggingExceptionFilter implements ExceptionFilter {
  constructor(private readonly logService: LogService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const responseData =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    // Extract error message correctly
    const errorMessage =
      typeof responseData === 'object' && 'message' in responseData
        ? responseData.message
        : responseData;

    const errorType =
      typeof responseData === 'object' && 'error' in responseData
        ? responseData.error
        : 'Bad Request'; // Default error message if not provided

    const responseStructure = {
      statusCode: status,
      message: errorMessage, // Flatten the message field
      error: errorType,
    };

    console.log(`[HTTP] ${request.method} ${request.url} - ${status}`);

    // Log the request and error
    await this.logService.logRequest({
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body,
      params: request.params,
      query: request.query,
      statusCode: status,
      response: responseStructure,
      error: errorMessage, // Ensure error message is logged properly
    });

    // Send clean error response
    response.status(status).json(responseStructure);
  }
}
