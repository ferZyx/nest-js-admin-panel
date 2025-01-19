import { ApiPropertyOptional } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { PaginateQuery } from 'libs/decorator/api-paginated.decorator';
import { ToBoolean } from 'libs/decorator/to_boolean.decorator';

export class ProductPaginateQueryDto extends PaginateQuery {
  @Allow()
  @ApiPropertyOptional({ default: false, required: false, type: Boolean })
  @ToBoolean()
  isDeleted?: boolean;
}
