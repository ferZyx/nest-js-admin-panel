import {
  Type as TypeNest,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

import { Allow } from 'class-validator';
import { TransformInterceptor } from './lean.decorator';

function PaginateResultFactory<T>(type: T) {
  class PaginateResult {
    @Expose()
    @Type(() => type as any)
    docs: T[];

    @ApiProperty()
    @Expose()
    totalDocs: number;
    @ApiProperty()
    @Expose()
    limit: number;
    @ApiProperty()
    @Expose()
    totalPages: number;
    @ApiPropertyOptional()
    @Expose()
    page?: number;
  }
  return PaginateResult;
}

export class PaginateQuery {
  @Allow()
  @Transform(({ value }) => Number(value))
  @ApiPropertyOptional({ default: 1, required: false, type: Number })
  page = 1;

  @Allow()
  @Transform(({ value }) => Number(value))
  @ApiPropertyOptional({ default: 10, required: false, type: Number })
  limit = 10;

  @ApiPropertyOptional({ default: '', required: false, type: String })
  @Allow()
  searchText? = '';

  @Allow()
  @Expose()
  @ApiPropertyOptional()
  @Transform(({ value, obj }) => {
    return (
      value ??
      (obj.sortField && `${obj.sortValue == '-1' ? '-' : ''}${obj.sortField}`)
    );
  })
  sort?: string;

  [key: string]: any;
}

export const ApiPaginated = <TModel extends TypeNest<any>>(model: TModel) => {
  return applyDecorators(
    UseInterceptors(new TransformInterceptor(PaginateResultFactory(model))),

    ApiExtraModels(PaginateResultFactory(model)),
    ApiExtraModels(model),
    ApiResponse({
      schema: {
        title: `Paginated${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginateResultFactory(model)) },
          {
            properties: {
              docs: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
