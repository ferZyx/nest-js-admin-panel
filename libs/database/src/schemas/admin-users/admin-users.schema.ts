import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@libs/database/schemas/base.schema';
import {
  HydratedDocument,
  SchemaTypes,
  Types,
  Schema as MSchema,
  QueryWithHelpers,
} from 'mongoose';
import { RolesDocument, RolesSchemaClass } from '../roles/roles.schema';
import { PaginateModelVirtual } from 'libs/database/src/types';
import { FilialsSchemaClass } from '@libs/database/schemas/filials/filials.schema';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'admin-users',
  id: true,
})
export class AdminUserSchemaClass extends BaseSchema {
  @Prop()
  name: string;

  @Prop()
  lastname?: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  username: string;

  @Prop()
  password: string;

  @Prop()
  current_refresh_token: string;

  @Prop({
    type: SchemaTypes.ObjectId,
  })
  roleId: Types.ObjectId;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_admin: boolean;

  @Prop({
    type: [SchemaTypes.ObjectId],
  })
  parentIds: Types.ObjectId[];

  @Prop({
    type: [SchemaTypes.ObjectId],
  })
  groupIds: Types.ObjectId[];
}

export interface IAdminUsersVirtuals {
  role?: RolesDocument;
  fullname: string;
}

export interface IAdminUsersQueryHelpers {
  excludeSuperAdminUser: () => QueryWithHelpers<
    AdminUserDocument[],
    AdminUserDocument,
    IAdminUsersQueryHelpers
  >;
  excludeSelf: (
    selfId: string | Types.ObjectId,
  ) => QueryWithHelpers<
    AdminUserDocument[],
    AdminUserDocument,
    IAdminUsersQueryHelpers
  >;
  onlyChildAdminUsers: (
    parentId: Types.ObjectId | string,
  ) => QueryWithHelpers<
    AdminUserDocument[],
    AdminUserDocument,
    IAdminUsersQueryHelpers
  >;
}

export type AdminUsersDbModel = PaginateModelVirtual<
  AdminUserSchemaClass,
  IAdminUsersQueryHelpers,
  unknown,
  IAdminUsersVirtuals
>;

export type AdminUserDocument = HydratedDocument<
  AdminUserSchemaClass,
  IAdminUsersVirtuals,
  IAdminUsersQueryHelpers
>;
export const AdminUserSchema = SchemaFactory.createForClass(
  AdminUserSchemaClass,
) as MSchema<
  AdminUserSchemaClass,
  AdminUsersDbModel,
  unknown,
  IAdminUsersQueryHelpers
>;
AdminUserSchema.virtual('fullname').get(function () {
  return `${this.lastname} ${this.name}`;
});

AdminUserSchema.query.excludeSuperAdminUser = function (
  this: QueryWithHelpers<any, AdminUserDocument, IAdminUsersQueryHelpers>,
) {
  return this.where({ username: { $ne: 'superadmin' } });
};

AdminUserSchema.query.excludeSelf = function (
  this: QueryWithHelpers<any, AdminUserDocument, IAdminUsersQueryHelpers>,
  selfId: Types.ObjectId,
) {
  return this.where({ id: { $ne: selfId } });
};

AdminUserSchema.query.onlyChildAdminUsers = function (
  this: QueryWithHelpers<any, AdminUserDocument, IAdminUsersQueryHelpers>,
  parentId: Types.ObjectId,
) {
  return this.where({ parentIds: parentId });
};

AdminUserSchema.virtual('role', {
  ref: RolesSchemaClass.name,
  localField: 'roleId',
  foreignField: '_id',
  justOne: true,
});

AdminUserSchema.virtual('filial', {
  ref: FilialsSchemaClass.name,
  localField: 'filialId',
  foreignField: '_id',
  justOne: true,
});

AdminUserSchema.virtual('parents', {
  ref: () => AdminUserSchemaClass.name,
  localField: 'parentIds',
  foreignField: '_id',
});
