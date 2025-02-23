import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;

@Schema({ timestamps: true })
export class Log {
  @Prop()
  method: string;

  @Prop()
  url: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  headers: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  body: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  params: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  query: Record<string, any>;

  @Prop()
  statusCode?: number;

  @Prop({ type: MongooseSchema.Types.Mixed, default: null })
  response?: any;

  @Prop({ type: MongooseSchema.Types.Mixed, default: null })
  error?: any;
}

export const LogSchema = SchemaFactory.createForClass(Log);
