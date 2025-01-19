import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminUsersService } from '../../admin-users/admin-users.service';
import { Request } from 'express';
import { AdminUserTokenPayload } from '../dto/admin-user-token-payload.dto';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private adminUsersService: AdminUsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ADMIN_REFRESH_JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: any,
  ): Promise<AdminUserTokenPayload> {
    const user = await this.adminUsersService.findOneById(payload._id);
    const refreshToken = request.body['refresh_token'];

    if (user.current_refresh_token != refreshToken || user.isDeleted) {
      throw new UnauthorizedException('Invalidated refresh token');
    }

    return { _id: user.id, username: user.username, is_admin: user.is_admin };
  }
}
