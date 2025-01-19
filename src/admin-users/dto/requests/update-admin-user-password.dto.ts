import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAdminUserPasswordDto {
  @ApiProperty()
  @IsString()
  password: string;
}
