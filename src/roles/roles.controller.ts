import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/requests/create-role.dto';
import { RolesService } from './roles.service';
import { UpdateRoleDto } from './dto/requests/update-role.dto';
import {
  ApiPaginated,
  PaginateQuery,
} from 'libs/decorator/api-paginated.decorator';
import { RoleDto } from './dto/responses/role.dto';
import { Lean } from 'libs/decorator/lean.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Permission } from 'libs/decorator/permissions.decorator';
import { PermissionsEnum } from '../permissions/permissions.enum';
import { CurrentUser } from 'libs/decorator/current-user.decorator';
import { AdminUserTokenPayload } from '../auth/dto/admin-user-token-payload.dto';
import { MessageResponseDto } from 'libs/dto/message.response.dto';

@Controller('roles')
@ApiTags('roles')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: MessageResponseDto })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiPaginated(RoleDto)
  @Permission(PermissionsEnum.GET_ROLES)
  async getRoles(
    @Query() query: PaginateQuery,
    @CurrentUser() user: AdminUserTokenPayload,
  ) {
    return this.rolesService.getRoles(query, user);
  }

  @Post()
  @Lean(RoleDto)
  @Permission(PermissionsEnum.CREATE_ROLE)
  createRole(
    @Body() createRoleDto: CreateRoleDto,
    @CurrentUser() user: AdminUserTokenPayload,
  ) {
    return this.rolesService.create(createRoleDto, user._id);
  }

  @Put(':id')
  @Lean(RoleDto)
  @Permission(PermissionsEnum.UPDATE_ROLE)
  @ApiParam({ type: String, name: 'id' })
  updateRole(
    @Param('id') roleId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(roleId, updateRoleDto);
  }

  @Delete(':id')
  @Permission(PermissionsEnum.DELETE_ROLE)
  @ApiParam({ type: String, name: 'id' })
  async deleteRole(@Param('id') roleId: string) {
    await this.rolesService.delete(roleId);
  }
}
