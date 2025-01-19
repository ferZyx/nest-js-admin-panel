import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { CreateAdminUserDto } from './dto/requests/create-admin-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UpdateAdminUserDto } from './dto/requests/update-admin-user.dto';
import { UpdateAdminUserPasswordDto } from './dto/requests/update-admin-user-password.dto';
import {
  AdminUserSchemaClass,
  AdminUsersDbModel,
} from '@libs/database/schemas/admin-users/admin-users.schema';
import { UserPaginateQueryDto } from './dto/user-paginate-query.dto';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class AdminUsersService {
  constructor(
    @Inject(AdminUserSchemaClass.name)
    private readonly adminUsers: AdminUsersDbModel,
    private configService: ConfigService,
  ) {}

  async createAdminUser(
    createAdminUserDto: CreateAdminUserDto,
    currentUserId: string,
  ) {
    const currentUser = await this.adminUsers
      .findById(currentUserId)
      .orFail()
      .exec();

    const adminUser = await this.adminUsers.create({
      ...createAdminUserDto,
      parentIds: [...currentUser.parentIds, currentUser.id],
      password: await this.hashPassword(createAdminUserDto.password),
    });

    return adminUser;
  }

  async hashPassword(rawPassword: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(
      rawPassword,
      Number(this.configService.get<string>('PASSWORD_HASHING_SALT_ROUND')),
    );

    return hashedPassword;
  }

  async updateAdminUser(
    adminUserId: string,
    updateAdminUserDto: UpdateAdminUserDto,
  ) {
    const updatedAdminUser = await this.adminUsers
      .findOneAndUpdate(
        {
          _id: adminUserId,
        },
        updateAdminUserDto,
        {
          new: true,
        },
      )
      .excludeSuperAdminUser()
      .orFail()
      .exec();
    return updatedAdminUser;
  }

  async updateAdminUserPassword(
    id: string,
    updateAdminUserPasswordDto: UpdateAdminUserPasswordDto,
  ) {
    return this.adminUsers
      .findOneAndUpdate(
        {
          _id: id,
        },
        {
          password: await this.hashPassword(
            updateAdminUserPasswordDto.password,
          ),
        },
        {
          new: true,
        },
      )
      .excludeSuperAdminUser()
      .orFail()
      .exec();
  }

  async findOneById(id: string | Types.ObjectId) {
    return this.adminUsers.findById(id, {}).orFail().exec();
  }

  async findOneByUsername(username: string) {
    return this.adminUsers.findOne({
      username,
      isDeleted: false,
    });
  }

  async deleteAdminUserById(id: string) {
    return this.adminUsers
      .updateOne(
        {
          _id: id,
        },
        {
          $set: {
            isDeleted: true,
          },
        },
      )
      .excludeSuperAdminUser()
      .orFail()
      .exec();
  }

  async recoverAdminUser(id: string) {
    return this.adminUsers
      .updateOne(
        {
          _id: id,
        },
        {
          $set: {
            isDeleted: false,
          },
        },
      )
      .excludeSuperAdminUser()
      .orFail()
      .exec();
  }

  getAdminUsers(
    { searchText, limit, page, sort, isDeleted }: UserPaginateQueryDto,
    currentUserId: string | undefined = undefined,
  ) {
    let query: FilterQuery<AdminUserSchemaClass> = {};

    if (currentUserId) {
      query = this.adminUsers
        .find()
        .excludeSelf(currentUserId)
        .excludeSuperAdminUser()
        // .onlyChildAdminUsers(currentUserId)
        .getFilter();
    }

    if (isNotEmpty(isDeleted)) {
      query['isDeleted'] = isDeleted;
    }

    if (searchText) {
      const regexp = { $regex: searchText, $options: 'i' };
      query['$or'] = [
        { name: regexp },
        { lastname: regexp },
        { username: regexp },
      ];
    }

    return this.adminUsers.paginate(
      {
        ...query,
      },
      {
        limit,
        page,
        sort,
        populate: { path: 'role' },
      },
    );
  }

  setRefreshToken(id: string, refreshToken: string) {
    return this.adminUsers.updateOne(
      { _id: id },
      { current_refresh_token: refreshToken },
    );
  }

  existsByRoleId(roleId: string) {
    return this.adminUsers.exists({
      roleId,
    });
  }
}
