import { RolesSchema } from '@libs/database/schemas/roles/roles.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';
import { IsExists } from 'libs/decorator/custom-validators/is-exists.decorator';
import { Types } from 'mongoose';
import { ToObjectId } from '../../../../libs/decorator/to_objectid';

export class CreateAdminUserDto {
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

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ type: String })
  @ToObjectId()
  @IsExists(RolesSchema.get('collection')!, '_id')
  @IsMongoId()
  @IsString()
  roleId: Types.ObjectId;
}
