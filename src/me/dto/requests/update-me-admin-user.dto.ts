import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateMeAdminUserDto {
  @ApiProperty()
  @IsString()
  name: string;
}
