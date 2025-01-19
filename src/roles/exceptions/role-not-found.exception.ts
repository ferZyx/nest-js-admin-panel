import { HttpException, HttpStatus } from '@nestjs/common';

export class RoleDoesNotExistException extends HttpException {
  constructor() {
    super('Роль не найдена', HttpStatus.FORBIDDEN);
  }
}
