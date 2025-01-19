import {
  AdminUserSchemaClass,
  AdminUsersDbModel,
} from '@libs/database/schemas/admin-users/admin-users.schema';
import { Inject, Injectable } from '@nestjs/common';
import { AdminUserTokenPayload } from '../auth/dto/admin-user-token-payload.dto';
import { UpdateMeAdminUserDto } from './dto/requests/update-me-admin-user.dto';
import { UpdateMeAdminUserPasswordDto } from './dto/requests/update-me-admin-user-password.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MeService {
  constructor(
    @Inject(AdminUserSchemaClass.name)
    private readonly adminUsers: AdminUsersDbModel,
    private readonly configService: ConfigService,
  ) {}

  private async hashPassword(rawPassword: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(
      rawPassword,
      Number(this.configService.get<string>('PASSWORD_HASHING_SALT_ROUND')),
    );

    return hashedPassword;
  }

  patchMe(user: AdminUserTokenPayload, body: UpdateMeAdminUserDto) {
    return this.adminUsers
      .findByIdAndUpdate(user._id, { $set: body }, { new: true })
      .populate('role');
  }

  getMe(user: AdminUserTokenPayload) {
    return this.adminUsers.findById(user._id).populate('role').orFail().exec();
  }

  async changePassword(
    user: AdminUserTokenPayload,
    body: UpdateMeAdminUserPasswordDto,
  ) {
    return this.adminUsers.findByIdAndUpdate(user._id, {
      $set: {
        password: await this.hashPassword(body.password),
      },
    });
  }
}
