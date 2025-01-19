import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ToObjectId } from '../../../../libs/decorator/to_objectid';

export class UpdateAdminUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastname: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty({ type: String })
  @ToObjectId()
  @IsMongoId()
  roleId: Types.ObjectId;
}
