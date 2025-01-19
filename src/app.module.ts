import { AdminGuardModule } from '@libs/admin-guard/admin-guard.module';
/* import { DatabaseModule } from '@libs/database'; */
import { Module } from '@nestjs/common';
import { GlobalConfigModule } from 'libs/config/global-config.module';
import { IsExistsConstraint } from 'libs/decorator/custom-validators/is-exists.decorator';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as process from 'process';
import { MeModule } from './me/me.module';
import { RolesModule } from './roles/roles.module';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { FilialsModule } from './filials/filials.module';

@Module({
  imports: [
    /* DatabaseModule, */ MongooseModule.forRoot(process.env.MONGODB_URI!, {
      autoIndex: true,
    }),
    GlobalConfigModule,
    AuthModule,
    AdminGuardModule,
    MeModule,
    RolesModule,
    AdminUsersModule,
    FilialsModule,
    FilialsModule,
  ],
  providers: [IsExistsConstraint],
})
export class AppModule {}
