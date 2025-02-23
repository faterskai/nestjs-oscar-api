import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { NomineesController } from './modules/nominees/nominees.controller';
import { NomineesService } from './modules/nominees/nominees.service';
import { NomineesModule } from './modules/nominees/nominees.module';
import { LogModule } from './modules/logs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://root:example@localhost:27017/',
    ),
    NomineesModule,
    LogModule,
  ],
  controllers: [AppController, NomineesController],
  providers: [AppService, NomineesService],
})
export class AppModule {}
