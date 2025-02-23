import { MongooseModule } from '@nestjs/mongoose';
import {
  Nominee,
  NomineeSchema,
} from 'src/modules/nominees/schemas/nominee.schema';
import { Module } from '@nestjs/common';
import { NomineesController } from './nominees.controller';
import { NomineesService } from './nominees.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Nominee.name, schema: NomineeSchema }]),
  ],
  controllers: [NomineesController],
  providers: [NomineesService],
  exports: [NomineesService, MongooseModule],
})
export class NomineesModule {}
