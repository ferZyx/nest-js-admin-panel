import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDto } from 'libs/dto/base.dto';
import { PermissionsEnum } from 'src/permissions/permissions.enum';

export class RoleDto extends BaseDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty({
    isArray: true,
    enum: PermissionsEnum,
  })
  @Expose()
  permissions: PermissionsEnum[];
}
