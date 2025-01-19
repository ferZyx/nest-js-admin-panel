import { Module } from '@nestjs/common';
import { ProductsProvider } from '@libs/database/schemas/products/products.provider';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [],
  exports: [ProductsProvider],
  controllers: [ProductsController],
  providers: [ProductsProvider, ProductsService],
})
export class ProductsModule {}
