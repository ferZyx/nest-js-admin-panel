import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import {
  ProductsDbModel,
  ProductsSchemaClass,
} from '@libs/database/schemas/products/products.schema';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { isNotEmpty } from 'class-validator';
import { ProductPaginateQueryDto } from './dto/product-paginate-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(ProductsSchemaClass.name)
    private readonly products: ProductsDbModel,
  ) {}

  async getProducts({
    limit,
    page,
    sort,
    searchText,
    isDeleted,
    filialId,
    otherQuery,
  }: ProductPaginateQueryDto) {
    const query: FilterQuery<ProductsSchemaClass> = { ...otherQuery };

    if (isNotEmpty(isDeleted)) {
      query['isDeleted'] = isDeleted;
    }
    if (isNotEmpty(filialId)) {
      query['filialId'] = filialId;
    }
    if (searchText) {
      query.name = { $regex: searchText, $options: 'i' };
    }

    return this.products.paginate(
      { ...query },
      {
        limit,
        page,
        sort,
        populate: ['filial'],
      },
    );
  }

  async createMany(createProductDto: CreateProductDto[]) {
    return await this.products.insertMany(createProductDto);
  }

  async create(createProductDto: CreateProductDto) {
    return await this.products.create(createProductDto);
  }

  update(productId: string, updateProductDto: UpdateProductDto) {
    return this.products
      .findOneAndUpdate(
        {
          _id: productId,
        },
        updateProductDto,
        {
          new: true,
        },
      )
      .orFail()
      .exec();
  }

  async delete(productId: string) {
    return this.products
      .updateOne(
        { _id: productId },
        {
          $set: {
            isDeleted: true,
          },
        },
      )
      .orFail()
      .exec();
  }

  async recoverProduct(id: string) {
    return this.products
      .updateOne(
        {
          _id: id,
        },
        {
          $set: {
            isDeleted: false,
          },
        },
      )
      .orFail()
      .exec();
  }
}
