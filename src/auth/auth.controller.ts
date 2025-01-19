import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RefreshJwtAuthGuard } from './guard/refresh-jwt-auth.guard';
import { LoginAdminUserDto } from './dto/login-admin-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginAdminUserResponseDto } from './dto/login-admin-user-response.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import { ExcludeFromAuthGuard } from 'libs/decorator/allow-unauthorized.decorator';
import { CurrentUser } from 'libs/decorator/current-user.decorator';

import { AdminUserTokenPayload } from './dto/admin-user-token-payload.dto';
import { MessageResponseDto } from 'libs/dto/message.response.dto';

@Controller('auth')
@ApiTags('auth')
@ApiBadRequestResponse({ type: MessageResponseDto })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  getHello(): string {
    return 'Hello bitchf';
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginAdminUserDto })
  @ApiResponse({ type: LoginAdminUserResponseDto })
  @ExcludeFromAuthGuard()
  async login(@CurrentUser() user: AdminUserTokenPayload) {
    return this.authService.login(user);
  }

  @Post('refresh-token')
  @UseGuards(RefreshJwtAuthGuard)
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ type: RefreshTokenResponseDto })
  @ExcludeFromAuthGuard()
  async refreshToken(@CurrentUser() user: AdminUserTokenPayload) {
    return this.authService.login(user);
  }
}
