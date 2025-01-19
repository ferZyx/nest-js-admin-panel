import { Module } from '@nestjs/common';
import { FilialsController } from './filials.controller';
import { FilialsService } from './filials.service';
import { FilialsProvider } from '@libs/database/schemas/filials/filials.provider';
import { ProductsProvider } from '@libs/database/schemas/products/products.provider';

@Module({
  imports: [],
  exports: [FilialsProvider, FilialsService],
  controllers: [FilialsController],
  providers: [FilialsProvider, ProductsProvider, FilialsService],
})
export class FilialsModule {}
