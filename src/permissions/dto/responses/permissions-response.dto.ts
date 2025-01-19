import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  PermissionGroups,
  PermissionsDict,
  PermissionsEnum,
} from '../../permissions.enum';

export class PermissionsFieldDto {
  @ApiProperty({ example: PermissionsDict.GET_ADMIN_USERS })
  @Expose()
  name: string;

  @ApiProperty({
    example: PermissionsEnum.GET_ADMIN_USERS,
    enum: PermissionsEnum,
  })
  @Expose()
  code: PermissionsEnum;
}

export class PermissionsResponseDto {
  @ApiProperty({ example: PermissionGroups.USERS })
  @Expose()
  name: string;

  @ApiProperty({ isArray: true, type: PermissionsFieldDto })
  @Expose()
  @Type(() => PermissionsFieldDto)
  permissions: PermissionsFieldDto[];
}
