import {
  Aggregate,
  AggregatePaginateResult,
  FilterQuery,
  Model,
  PaginateDocument,
  PaginateOptions,
  PaginateResult,
} from 'mongoose';

export interface PaginateModelVirtual<
  T,
  TQueryHelpers = unknown,
  TMethods = unknown,
  TVirtuals = unknown,
> extends Model<T, TQueryHelpers, TMethods, TVirtuals> {
  paginate<UserType = T>(
    query?: FilterQuery<T>,
    options?: PaginateOptions,
    callback?: (
      err: any,
      result: PaginateResult<
        PaginateDocument<UserType, TMethods, TVirtuals, PaginateOptions>
      >,
    ) => void,
  ): Promise<
    PaginateResult<
      PaginateDocument<
        UserType,
        TMethods & TVirtuals,
        TVirtuals,
        PaginateOptions
      >
    >
  >;
}

export interface AggregatePaginateModelVirtual<
  T,
  TQueryHelpers = unknown,
  TMethods = unknown,
  TVirtuals = unknown,
> extends PaginateModelVirtual<T, TQueryHelpers, TMethods, TVirtuals> {
  aggregatePaginate<T>(
    query?: Aggregate<T[]>,
    options?: PaginateOptions,
    callback?: (
      err: any,
      result: AggregatePaginateResult<
        PaginateDocument<T, TMethods, TVirtuals, PaginateOptions>
      >,
    ) => void,
  ): Promise<
    AggregatePaginateResult<
      PaginateDocument<T, TMethods, TVirtuals, PaginateOptions>
    >
  >;
}
