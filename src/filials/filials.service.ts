import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { PaginateQuery } from 'libs/decorator/api-paginated.decorator';
import { CreateFilialDto } from './dto/requests/create-filial.dto';
import { UpdateFilialDto } from './dto/requests/update-filial.dto';
import {
  FilialsDbModel,
  FilialsSchemaClass,
} from '@libs/database/schemas/filials/filials.schema';

@Injectable()
export class FilialsService {
  constructor(
    @Inject(FilialsSchemaClass.name)
    private readonly filials: FilialsDbModel,
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
      { limit, page, sort, populate: 'adminUser members filialGrade' },
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
    const isFilialUsersExists = await this.filials.exists({
      _id: filialId,
      users: { $exists: true, $not: { $size: 0 } },
    });

    if (isFilialUsersExists) {
      throw new ForbiddenException(
        'Эту группу нельзя удалить, так как она все еще содержит в себе пользователей',
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
