import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminUserResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}
