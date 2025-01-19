import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { AdminUsersProvider } from '@libs/database/schemas/admin-users/admin-users.provider';
import { RolesProvider } from '@libs/database/schemas/roles/roles.provider';
import { AdminUsersModule } from '../admin-users/admin-users.module';

@Module({
  imports: [AdminUsersModule],
  exports: [PermissionsService],
  controllers: [PermissionsController],
  providers: [PermissionsService, AdminUsersProvider, RolesProvider],
})
export class PermissionsModule {}
