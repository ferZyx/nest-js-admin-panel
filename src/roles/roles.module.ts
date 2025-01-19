import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RolesProvider } from '@libs/database/schemas/roles/roles.provider';
import { AdminUsersModule } from '../admin-users/admin-users.module';
import { AdminUsersProvider } from '@libs/database/schemas/admin-users/admin-users.provider';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [AdminUsersModule, PermissionsModule],
  exports: [RolesService],
  controllers: [RolesController],
  providers: [RolesService, RolesProvider, AdminUsersProvider],
})
export class RolesModule {}
