import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseDto {
  @Expose()
  _id?: string;

  @Expose({ name: '_id' })
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  createdAt?: Date;
  @Expose()
  @ApiProperty()
  updatedAt?: Date;

  @Expose()
  @ApiProperty()
  isDeleted?: boolean;
}
