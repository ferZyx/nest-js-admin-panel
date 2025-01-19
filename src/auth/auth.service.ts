import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { AdminUsersService } from '../admin-users/admin-users.service';
import { ConfigService } from '@nestjs/config';
import { AdminUserTokenPayload } from './dto/admin-user-token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private adminUserService: AdminUsersService,
    private configService: ConfigService,
  ) {}

  getRefreshTokenConfig(): JwtSignOptions {
    return {
      secret: this.configService.get('ADMIN_REFRESH_JWT_SECRET'),
      expiresIn: '7d',
    };
  }

  getAccessTokenConfig(): JwtSignOptions {
    return {
      secret: this.configService.get('ADMIN_JWT_SECRET'),
      expiresIn: '1d',
    };
  }

  async login(payload: AdminUserTokenPayload) {
    const accessToken = await this.generateJwtToken(
      payload,
      this.getAccessTokenConfig(),
    );

    const refreshToken = await this.generateJwtToken(
      payload,
      this.getRefreshTokenConfig(),
    );

    await this.adminUserService.setRefreshToken(payload._id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async comparePasswords(
    userRequestedPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(userRequestedPassword, hashedPassword);
  }

  async generateJwtToken(
    payload: AdminUserTokenPayload,
    tokenConfig: JwtSignOptions,
  ) {
    return this.jwtService.signAsync(payload, tokenConfig);
  }

  async validateUser(username: string, password: string) {
    const user = await this.adminUserService.findOneByUsername(username);

    if (user && (await this.comparePasswords(password, user.password))) {
      return user;
    }

    return null;
  }

  async validateRefreshToken(refresh_token: string) {
    return this.jwtService.verifyAsync(refresh_token, {
      secret: this.getRefreshTokenConfig().secret,
    });
  }
}
