import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDto } from 'libs/dto/base.dto';
import { RoleDto } from 'src/roles/dto/responses/role.dto';

export class AdminUserResponseDto extends BaseDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  lastname?: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  roleId: string;

  @ApiProperty()
  @Expose()
  role: RoleDto;

  @ApiProperty()
  @Expose()
  is_admin: boolean;
}
