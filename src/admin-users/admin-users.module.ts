import { Module } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersProvider } from '@libs/database/schemas/admin-users/admin-users.provider';
import { RolesProvider } from '@libs/database/schemas/roles/roles.provider';

@Module({
  exports: [AdminUsersService],
  controllers: [AdminUsersController],
  providers: [AdminUsersService, AdminUsersProvider, RolesProvider],
})
export class AdminUsersModule {}
