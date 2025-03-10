import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LogService } from './../../modules/logs/logs.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers, body, params, query } = request;

    return next.handle().pipe(
      tap(async (response) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        console.log(`[HTTP] ${request.method} ${request.url} - ${statusCode}`);

        await this.logService.logRequest({
          method,
          url,
          headers,
          body,
          params,
          query,
          statusCode,
          response,
        });
      }),
    );
  }
}
