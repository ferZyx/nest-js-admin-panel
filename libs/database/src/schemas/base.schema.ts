import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, id: true })
export class BaseSchema {
  _id: Types.ObjectId;

  @Prop({ default: false })
  isDeleted?: boolean;

  @Prop({ default: Date.now })
  createdAt: Date = new Date();

  @Prop({ default: Date.now })
  updatedAt: Date = new Date();
}

export const BaseSchemaClass = SchemaFactory.createForClass(BaseSchema);
