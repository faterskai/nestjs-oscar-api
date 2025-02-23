import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NomineeDocument = HydratedDocument<Nominee>;

@Schema({ timestamps: true })
export class Nominee {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  release: number;

  @Prop({ required: true })
  director: string;

  @Prop({ default: false })
  winner: boolean;
}

export const NomineeSchema = SchemaFactory.createForClass(Nominee);
