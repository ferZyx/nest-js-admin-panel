import { Controller, Get } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  PermissionsFieldDto,
  PermissionsResponseDto,
} from './dto/responses/permissions-response.dto';
import { CurrentUser } from 'libs/decorator/current-user.decorator';
import { AdminUserTokenPayload } from '../auth/dto/admin-user-token-payload.dto';
import { Lean } from 'libs/decorator/lean.decorator';

@Controller('permissions')
@ApiTags('permissions')
@ApiBearerAuth()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('/groups')
  @ApiOperation({ summary: 'Группированные права, доступные пользователю' })
  @Lean(PermissionsResponseDto, true)
  async getPermissions(@CurrentUser() user: AdminUserTokenPayload) {
    return this.permissionsService.getUserGroupedPermissions(user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Все возможные права' })
  @Lean(PermissionsFieldDto, true)
  async getPermissionsList() {
    return this.permissionsService.getPermissions();
  }
}
