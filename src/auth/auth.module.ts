import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminUsersModule } from '../admin-users/admin-users.module';

import { LocalStrategy } from './strategies/local.strategy';

import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';

import { AdminGuardModule } from '@libs/admin-guard';

@Module({
  imports: [AdminUsersModule, AdminGuardModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, RefreshJwtStrategy],
})
export class AuthModule {}
