import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import {
  ProductsDbModel,
  ProductsSchemaClass,
} from '@libs/database/schemas/products/products.schema';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { UserPaginateQueryDto } from 'src/admin-users/dto/user-paginate-query.dto';
import { isNotEmpty } from 'class-validator';
import {
  AdminUserSchemaClass,
  AdminUsersDbModel,
} from '@libs/database/schemas/admin-users/admin-users.schema';
import {
  FilialsDbModel,
  FilialsSchemaClass,
} from '@libs/database/schemas/filials/filials.schema';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(FilialsSchemaClass.name)
    private readonly filials: FilialsDbModel,

    @Inject(AdminUserSchemaClass.name)
    private readonly adminUsers: AdminUsersDbModel,

    @Inject(ProductsSchemaClass.name)
    private readonly products: ProductsDbModel,
  ) {}

  async getProducts({
    limit,
    page,
    sort,
    searchText,
    isDeleted,
    groupId,
    otherQuery,
  }: UserPaginateQueryDto) {
    const query: FilterQuery<ProductsSchemaClass> = { ...otherQuery };

    if (isNotEmpty(isDeleted)) {
      query['isDeleted'] = isDeleted;
    }
    if (isNotEmpty(groupId)) {
      query['filialId'] = groupId;
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
        populate: [{ path: 'group', populate: 'adminUser' }],
      },
    );
  }

  async createMany(createProductDto: CreateProductDto[]) {
    const products = await this.products.insertMany(createProductDto);
    await this.filials
      .updateMany(
        { _id: { $in: products.map((product) => product.groupId) } },
        {
          $push: {
            memberIds: { $each: products.map((product) => product._id) },
          },
        },
      )
      .exec();

    return products;
  }

  async create(createUserDto: CreateProductDto) {
    const product = await this.products.create(createUserDto);

    await this.filials
      .updateOne(
        { _id: product.filialId },
        {
          $push: { memberIds: product._id },
        },
      )
      .exec();

    return product;
  }

  // async updateGroupIds() {
  //   const adminUsers = await this.adminUsers.find().exec();
  //   const filials = await this.filials.find().populate('adminUser').exec();

  //   for (const product of adminUsers) {
  //     const groupsL = filials.filter((group) =>
  //       group.adminUser?._id.equals(product._id),
  //     );
  //     if (groupsL.length) {
  //       await this.adminUsers
  //         .updateOne(
  //           { _id: product._id },
  //           {
  //             $push: { groupIds: { $each: groupsL.map((group) => group._id) } },
  //           },
  //         )
  //         .exec();
  //     }
  //   }
  //   console.log(filials);

  //   // const products = await this.products.find().exec();

  //   // await this.filials.updateMany({}, { $set: { memberIds: [] } }).exec();

  //   return adminUsers;
  // }

  update(productId: string, updateUserDto: UpdateProductDto) {
    return this.products
      .findOneAndUpdate(
        {
          _id: productId,
        },
        updateUserDto,
        {
          new: true,
        },
      )
      .orFail()
      .exec();
  }

  async delete(productId: string) {
    await this.filials
      .updateOne({ memberIds: productId }, { $pull: { memberIds: productId } })
      .orFail()
      .exec();

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

  async recoverUser(id: string) {
    const product = await this.products.findById(id).exec();

    await this.filials
      .updateOne(
        { _id: product?.filialId },
        {
          $push: { memberIds: product?._id },
        },
      )
      .orFail()
      .exec();

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
