import { Module } from '@nestjs/common';
import { FilialsController } from './filials.controller';
import { FilialsService } from './filials.service';
import { FilialsProvider } from '@libs/database/schemas/filials/filials.provider';
import { ProductsProvider } from '@libs/database/schemas/products/products.provider';
import { AdminUsersProvider } from '@libs/database/schemas/admin-users/admin-users.provider';

@Module({
  imports: [],
  exports: [FilialsProvider, FilialsService],
  controllers: [FilialsController],
  providers: [
    FilialsProvider,
    ProductsProvider,
    FilialsService,
    AdminUsersProvider,
  ],
})
export class FilialsModule {}
