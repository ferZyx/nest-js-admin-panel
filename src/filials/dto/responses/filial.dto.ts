import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDto } from 'libs/dto/base.dto';

export class FilialDto extends BaseDto {
  @ApiProperty()
  @Expose()
  name: string;
}
