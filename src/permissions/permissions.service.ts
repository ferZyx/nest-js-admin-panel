import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  PermissionGroups,
  PermissionsDict,
  PermissionsEnum,
  PermissionsGroupsDict,
} from './permissions.enum';

import {
  AdminUserSchemaClass,
  AdminUsersDbModel,
} from '@libs/database/schemas/admin-users/admin-users.schema';
import {
  RolesDbModel,
  RolesSchemaClass,
} from '@libs/database/schemas/roles/roles.schema';

@Injectable()
export class PermissionsService implements OnApplicationBootstrap {
  constructor(
    @Inject(AdminUserSchemaClass.name)
    private readonly adminUsers: AdminUsersDbModel,
    @Inject(RolesSchemaClass.name)
    private readonly roles: RolesDbModel,
  ) {}
  async onApplicationBootstrap() {
    let admin = await this.adminUsers
      .findOne({ is_admin: true })
      .populate('role')
      .exec();

    if (!admin) {
      admin = await this.adminUsers.create({
        name: 'Admin',
        username: 'SUPERADMIN',
        // FIXME: пароль не хешируется
        password: 'SUPERADMINSUPERADMIN!',
        is_admin: true,
      });
    }

    if (admin?.role) {
      admin.role.permissions = Object.values(PermissionsEnum);

      await admin.role?.save();
      await admin.save();
    } else {
      const roleDBO = await this.roles.create({
        permissions: Object.values(PermissionsEnum),
        name: 'Суперадминистратор',
        description: 'Главный аккаунт',
        is_admin: true,
      });
      admin.roleId = roleDBO._id;
      await admin.save();
    }
  }

  getPermissions() {
    const permissions: any = [];

    for (const permission in PermissionsDict) {
      permissions.push({
        name: PermissionsDict[permission],
        code: permission,
      });
    }

    return permissions;
  }

  async getUserGroupedPermissions(userId: string) {
    const userPermissions = await this.getUserPermissions(userId);
    const groupedPermissions = PermissionsGroupsDict;
    const permissionsTranslation = PermissionsDict;

    const userGroupedPermissions: any = [];

    for (const userPermission of userPermissions) {
      for (const group in groupedPermissions) {
        if (groupedPermissions[group].has(userPermission)) {
          let isPermissionAdded = false;

          for (let i = 0; i < userGroupedPermissions.length; i++) {
            if (userGroupedPermissions[i].name === PermissionGroups[group]) {
              isPermissionAdded = true;
              userGroupedPermissions[i].permissions.push({
                name: permissionsTranslation[userPermission],
                code: userPermission,
              });
            }
          }

          if (!isPermissionAdded) {
            userGroupedPermissions.push({
              name: PermissionGroups[group],
              permissions: [
                {
                  name: permissionsTranslation[userPermission],
                  code: userPermission,
                },
              ],
            });
          }
        }
      }
    }

    return userGroupedPermissions;
  }

  findByName(value: string) {
    return PermissionsEnum[value];
  }

  async getUserPermissions(userId: Types.ObjectId | string) {
    const user = await this.adminUsers
      .findById(userId)
      .populate('role')
      .orFail();

    if (!user.role) {
      return [];
    }

    return user.role.permissions;
  }

  async checkAdminUserHasPermissions(
    userId: string,
    permissions: PermissionsEnum[],
  ) {
    const adminUserPermissions = await this.getUserPermissions(userId);

    const adminUserPermissionsSet = new Set(adminUserPermissions);

    for (const requiredPermission of permissions) {
      if (!adminUserPermissionsSet.has(requiredPermission)) {
        return false;
      }
    }

    return true;
  }
}
