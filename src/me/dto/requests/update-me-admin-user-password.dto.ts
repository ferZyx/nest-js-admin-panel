import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateMeAdminUserPasswordDto {
  @ApiProperty()
  @IsString()
  password: string;
}
