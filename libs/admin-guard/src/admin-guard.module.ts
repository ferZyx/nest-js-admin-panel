import { AdminUsersProvider } from '@libs/database/schemas/admin-users/admin-users.provider';
import { RolesProvider } from '@libs/database/schemas/roles/roles.provider';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AdminJwtAuthGuard } from '@libs/admin-guard/admin-jwt-auth.guard';
import { AdminJwtStrategy } from '@libs/admin-guard/admin-jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PermissionsGuard } from 'src/permissions/guards/permissions.guard';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
  imports: [JwtModule.register({ global: true }), PermissionsModule],
  providers: [
    AdminJwtStrategy,
    AdminUsersProvider,
    RolesProvider,
    {
      provide: APP_GUARD,
      useClass: AdminJwtAuthGuard,
    },

    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AdminGuardModule {}
