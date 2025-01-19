import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { AdminUserResponseDto } from './dto/admin-user.response.dto';
import { Lean } from 'libs/decorator/lean.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAdminUserDto } from './dto/requests/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/requests/update-admin-user.dto';
import { ApiPaginated } from 'libs/decorator/api-paginated.decorator';
import { UpdateAdminUserPasswordDto } from './dto/requests/update-admin-user-password.dto';
import { Permission } from 'libs/decorator/permissions.decorator';
import { PermissionsEnum } from '../permissions/permissions.enum';
import { MessageResponseDto } from 'libs/dto/message.response.dto';
import { CurrentUser } from 'libs/decorator/current-user.decorator';
import { AdminUserTokenPayload } from '../auth/dto/admin-user-token-payload.dto';
import { UserPaginateQueryDto } from './dto/user-paginate-query.dto';

@Controller('admin-users')
@ApiTags('admin-users')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: MessageResponseDto })
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiPaginated(AdminUserResponseDto)
  @Permission(PermissionsEnum.GET_ADMIN_USERS)
  async getAdminUsers(
    @Query() query: UserPaginateQueryDto,
    @CurrentUser() adminUser: AdminUserTokenPayload,
  ) {
    return adminUser.is_admin
      ? this.adminUsersService.getAdminUsers(query)
      : this.adminUsersService.getAdminUsers(query, adminUser._id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @Lean(AdminUserResponseDto)
  async getAdminUser(@Param('id') adminUserId: string) {
    return this.adminUsersService.findOneById(adminUserId);
  }

  @Post()
  @Lean(AdminUserResponseDto)
  @Permission(PermissionsEnum.CREATE_ADMIN_USER)
  async createAdminUser(
    @Body() createAdminUserDto: CreateAdminUserDto,
    @CurrentUser() adminUser: AdminUserTokenPayload,
  ) {
    return this.adminUsersService.createAdminUser(
      createAdminUserDto,
      adminUser._id,
    );
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String })
  @Lean(AdminUserResponseDto)
  @Permission(PermissionsEnum.UPDATE_ADMIN_USER)
  async updateAdminUser(
    @Body() updateAdminUserDto: UpdateAdminUserDto,
    @Param('id') adminUserId: string,
  ) {
    return this.adminUsersService.updateAdminUser(
      adminUserId,
      updateAdminUserDto,
    );
  }

  @Patch(':id/update-password')
  @ApiParam({ name: 'id', type: String })
  @Lean(AdminUserResponseDto)
  @Permission(PermissionsEnum.CHANGE_ADMIN_USER_PASSWORD)
  async updateAdminUserPassword(
    @Body() updateAdminUserPasswordDto: UpdateAdminUserPasswordDto,
    @Param('id') adminUserId: string,
  ) {
    return this.adminUsersService.updateAdminUserPassword(
      adminUserId,
      updateAdminUserPasswordDto,
    );
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @Permission(PermissionsEnum.DELETE_ADMIN_USER)
  async deleteAdminUser(@Param('id') adminUserId: string) {
    await this.adminUsersService.deleteAdminUserById(adminUserId);
  }

  @Post('/recover/:id')
  @Permission(PermissionsEnum.RECOVER_ADMIN_USER)
  async recoverAdminUser(@Param('id') adminUserId: string) {
    await this.adminUsersService.recoverAdminUser(adminUserId);
  }
}
