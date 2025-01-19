import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { PermissionsEnum } from 'src/permissions/permissions.enum';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({
    isArray: true,
    enum: PermissionsEnum,
  })
  @IsEnum(PermissionsEnum, { each: true })
  @IsArray()
  permissions: PermissionsEnum[];
}
