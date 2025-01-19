import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@libs/database/schemas/base.schema';
import { HydratedDocument } from 'mongoose';
import { PaginateModelVirtual } from '@libs/database/types';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'filials',
  id: true,
})
export class FilialsSchemaClass extends BaseSchema {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  name: string;
}

export const FilialsSchema = SchemaFactory.createForClass(FilialsSchemaClass);

export interface IFilialsVirtuals {}

export type FilialsDbModel = PaginateModelVirtual<
  FilialsSchemaClass,
  unknown,
  unknown,
  IFilialsVirtuals
>;

export type FilialsDocument = HydratedDocument<
  FilialsSchemaClass,
  IFilialsVirtuals
>;
