import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AdminUserTokenPayload } from '../dto/admin-user-token-payload.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<AdminUserTokenPayload> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new BadRequestException('Введен не правильный логин или пароль');
    }
    return { _id: user.id, username: user.username, is_admin: user.is_admin };
  }
}
