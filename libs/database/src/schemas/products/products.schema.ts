import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@libs/database/schemas/base.schema';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { PaginateModelVirtual } from 'libs/database/src/types';
import { FilialsSchemaClass } from '@libs/database/schemas/filials/filials.schema';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'products',
  id: true,
})
export class ProductsSchemaClass extends BaseSchema {
  @Prop({ trim: true })
  name: string;
  @Prop({
    type: SchemaTypes.ObjectId,
  })
  filialId: Types.ObjectId;
}

export type ProductsDbModel = PaginateModelVirtual<
  ProductsSchemaClass,
  unknown,
  unknown,
  IProductsVirtuals
>;

export type ProductsDocument = HydratedDocument<
  ProductsSchemaClass,
  IProductsVirtuals
>;
export const ProductsSchema = SchemaFactory.createForClass(ProductsSchemaClass);

export interface IProductsVirtuals {
  age: string;
  filial: FilialsSchemaClass;
}

ProductsSchema.virtual('filial', {
  foreignField: '_id',
  localField: 'filialId',
  ref: () => FilialsSchemaClass.name,
  justOne: true,
});
