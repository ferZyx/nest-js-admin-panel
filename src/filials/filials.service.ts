import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { PaginateQuery } from 'libs/decorator/api-paginated.decorator';
import { CreateFilialDto } from './dto/requests/create-filial.dto';
import { UpdateFilialDto } from './dto/requests/update-filial.dto';
import {
  FilialsDbModel,
  FilialsSchemaClass,
} from '@libs/database/schemas/filials/filials.schema';
import {
  ProductsDbModel,
  ProductsSchemaClass,
} from '@libs/database/schemas/products/products.schema';

@Injectable()
export class FilialsService {
  constructor(
    @Inject(FilialsSchemaClass.name)
    private readonly filials: FilialsDbModel,

    @Inject(ProductsSchemaClass.name)
    private readonly products: ProductsDbModel,
  ) {}

  async getFilial(filialId: Types.ObjectId) {
    return this.filials.findById(filialId);
  }

  async getFilials({ limit, page, sort, searchText }: PaginateQuery) {
    const query: FilterQuery<FilialsSchemaClass> = {};

    if (searchText) {
      query.name = { $regex: searchText, $options: 'i' };
    }
    const filials = await this.filials.paginate(
      { ...query },
      { limit, page, sort },
    );

    return filials;
  }

  async create(createFilialDto: CreateFilialDto) {
    return await this.filials.create(createFilialDto);
  }

  async update(filialId: string, updateFilialDto: UpdateFilialDto) {
    return await this.filials
      .findOneAndUpdate(
        {
          _id: filialId,
        },
        updateFilialDto,
        { new: true },
      )
      .orFail()
      .exec();
  }

  async delete(filialId: Types.ObjectId) {
    const isFilialProductsExists = await this.products.exists({
      filialId: filialId,
    });

    if (isFilialProductsExists) {
      throw new ForbiddenException(
        'Этот филиал нельзя удалить, так как к нему привязаны товары. Удалите сначала их.',
      );
    }

    return this.filials
      .deleteOne({
        _id: filialId,
      })
      .orFail()
      .exec();
  }
}
