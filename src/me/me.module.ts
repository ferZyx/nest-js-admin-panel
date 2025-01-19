import { Module } from '@nestjs/common';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { AdminUsersProvider } from '@libs/database/schemas/admin-users/admin-users.provider';

@Module({
  controllers: [MeController],
  providers: [MeService, AdminUsersProvider],
})
export class MeModule {}
