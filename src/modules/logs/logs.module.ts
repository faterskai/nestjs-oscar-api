import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { Log, LogSchema } from './schemas/log.schema';
import { LogService } from './logs.service';
import { LoggingInterceptor } from 'src/common/interceptors/logging-interceptor';
import { LoggingExceptionFilter } from 'src/common/filters/logging-exception-filter';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  providers: [
    LogService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: LoggingExceptionFilter,
    },
  ],
  exports: [LogService, MongooseModule],
})
export class LogModule {}
