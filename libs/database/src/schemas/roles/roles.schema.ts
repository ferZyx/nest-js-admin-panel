import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@libs/database/schemas/base.schema';
import {
  HydratedDocument,
  QueryWithHelpers,
  Schema as MSchema,
  SchemaTypes,
  Types,
} from 'mongoose';
import { PaginateModelVirtual } from '@libs/database/types';
import {
  AdminUserDocument,
  AdminUserSchemaClass,
} from '../admin-users/admin-users.schema';
import { PermissionsEnum } from 'src/permissions/permissions.enum';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'roles',
  id: true,
})
export class RolesSchemaClass extends BaseSchema {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop()
  description: string;

  @Prop()
  permissions: PermissionsEnum[];

  @Prop({
    type: Boolean,
    default: false,
  })
  is_admin: boolean;

  @Prop({ type: SchemaTypes.ObjectId })
  adminUserId: Types.ObjectId;
}

export interface IRolesVirtuals {
  adminUser?: AdminUserDocument;
}

export interface IRolesQueryHelpers {
  excludeSuperadminRole: () => QueryWithHelpers<
    RolesDocument[],
    RolesDocument,
    IRolesQueryHelpers
  >;
  onlyOwn(
    ownerId: string | Types.ObjectId,
  ): QueryWithHelpers<RolesDocument[], RolesDocument, IRolesQueryHelpers>;
}

export type RolesDbModel = PaginateModelVirtual<
  RolesSchemaClass,
  IRolesQueryHelpers,
  unknown,
  IRolesVirtuals
>;

export type RolesDocument = HydratedDocument<
  RolesSchemaClass,
  unknown,
  IRolesQueryHelpers
>;
export const RolesSchema = SchemaFactory.createForClass(
  RolesSchemaClass,
) as MSchema<
  RolesSchemaClass,
  RolesDbModel,
  unknown,
  IRolesQueryHelpers,
  IRolesVirtuals
>;

RolesSchema.virtual('adminUser', {
  ref: () => AdminUserSchemaClass.name,
  localField: 'adminUserId',
  foreignField: '_id',
  justOne: true,
});

RolesSchema.query.excludeSuperadminRole = function (
  this: QueryWithHelpers<any, RolesDocument, IRolesQueryHelpers>,
) {
  return this.where({ is_admin: false });
};

RolesSchema.query.onlyOwn = function (
  this: QueryWithHelpers<any, RolesDocument, IRolesQueryHelpers>,
  ownerId: string,
) {
  return this.where({ adminUserId: ownerId });
};
