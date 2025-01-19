import { Module } from '@nestjs/common';
import { ProductsProvider } from '@libs/database/schemas/products/products.provider';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { FilialsProvider } from '@libs/database/schemas/filials/filials.provider';
import { AdminUsersProvider } from '@libs/database/schemas/admin-users/admin-users.provider';

@Module({
  imports: [],
  exports: [ProductsProvider],
  controllers: [ProductsController],
  providers: [
    ProductsProvider,
    FilialsProvider,
    ProductsService,
    AdminUsersProvider,
  ],
})
export class ProductsModule {}
