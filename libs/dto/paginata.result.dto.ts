import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaginateResult<T> {
  @Expose()
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
