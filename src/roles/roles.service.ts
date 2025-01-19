import {
  RolesDbModel,
  RolesSchemaClass,
} from '@libs/database/schemas/roles/roles.schema';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CreateRoleDto } from './dto/requests/create-role.dto';
import { UpdateRoleDto } from './dto/requests/update-role.dto';
import { PaginateQuery } from 'libs/decorator/api-paginated.decorator';
import {
  AdminUserSchemaClass,
  AdminUsersDbModel,
} from '@libs/database/schemas/admin-users/admin-users.schema';
import { PermissionsService } from '../permissions/permissions.service';
import { AdminUserTokenPayload } from '../auth/dto/admin-user-token-payload.dto';

@Injectable()
export class RolesService {
  constructor(
    @Inject(RolesSchemaClass.name)
    private readonly roles: RolesDbModel,
    @Inject(AdminUserSchemaClass.name)
    private readonly adminUsers: AdminUsersDbModel,
    private readonly permissionsService: PermissionsService,
  ) {}

  getRoles(
    { limit, page, sort, searchText }: PaginateQuery,
    requestingAdminUserId: AdminUserTokenPayload,
  ) {
    let query: FilterQuery<RolesSchemaClass> = {};

    if (!requestingAdminUserId.is_admin) {
      query = this.roles.find().onlyOwn(requestingAdminUserId._id).getFilter();
    }

    if (searchText) {
      query.name = { $regex: searchText, $options: 'i' };
    }

    return this.roles.paginate(
      { ...query, is_admin: false },
      { limit, page, sort },
    );
  }

  async create(createRoleDto: CreateRoleDto, requestingAdminUserId: string) {
    const checkRequestingUserHasAllPermissions =
      await this.permissionsService.checkAdminUserHasPermissions(
        requestingAdminUserId,
        createRoleDto.permissions,
      );

    if (!checkRequestingUserHasAllPermissions) {
      throw new ForbiddenException(
        'У пользователя недостаточно прав для создания этой роли',
      );
    }

    return this.roles.create({
      ...createRoleDto,
      adminUserId: requestingAdminUserId,
    });
  }

  findByFieldValue(field: string, value: string) {
    return this.roles.findOne({
      [field]: value,
    });
  }

  update(roleId: string, updateRoleDto: UpdateRoleDto) {
    return this.roles
      .findOneAndUpdate(
        {
          _id: roleId,
        },
        updateRoleDto,
        {
          new: true,
        },
      )
      .orFail()
      .exec();
  }

  async delete(roleId: string) {
    const isAdminUsersExists = await this.adminUsers.exists({
      roleId,
    });

    if (isAdminUsersExists) {
      throw new ForbiddenException(
        'Эту роль нельзя удалить, так как она все еще прикреплена',
      );
    }

    return this.roles
      .deleteOne({
        _id: roleId,
      })
      .orFail()
      .exec();
  }
}
