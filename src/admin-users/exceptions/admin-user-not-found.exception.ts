import { HttpException, HttpStatus } from '@nestjs/common';

export class AdminUserDoesNotExistException extends HttpException {
  constructor() {
    super('User with given attribute does not exist', HttpStatus.FORBIDDEN);
  }
}
