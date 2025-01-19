import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { MeService } from './me.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateMeAdminUserDto } from './dto/requests/update-me-admin-user.dto';
import { CurrentUser } from 'libs/decorator/current-user.decorator';
import { AdminUserTokenPayload } from '../auth/dto/admin-user-token-payload.dto';
import { Lean } from 'libs/decorator/lean.decorator';
import { MeAdminUserResponseDto } from './dto/responses/me-admin-user.response.dto';
import { UpdateMeAdminUserPasswordDto } from './dto/requests/update-me-admin-user-password.dto';

@Controller('me')
@ApiTags('me')
@ApiBearerAuth()
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Patch()
  @Lean(MeAdminUserResponseDto)
  patchMe(
    @Body() body: UpdateMeAdminUserDto,
    @CurrentUser() user: AdminUserTokenPayload,
  ) {
    return this.meService.patchMe(user, body);
  }

  @Get()
  @Lean(MeAdminUserResponseDto)
  getMe(@CurrentUser() user: AdminUserTokenPayload) {
    return this.meService.getMe(user);
  }

  @Post('/password')
  @Lean(MeAdminUserResponseDto)
  changePassword(
    @Body() body: UpdateMeAdminUserPasswordDto,
    @CurrentUser() user: AdminUserTokenPayload,
  ) {
    return this.meService.changePassword(user, body);
  }
}
