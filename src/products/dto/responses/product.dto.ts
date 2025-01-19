import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDto } from 'libs/dto/base.dto';
import { FilialDto } from '../../../filials/dto/responses/filial.dto';

export class ProductDto extends BaseDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({ type: FilialDto })
  @Expose()
  filial: FilialDto;

  @ApiProperty()
  @Expose()
  filialId: string;
}
