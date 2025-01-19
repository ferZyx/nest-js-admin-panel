import { HttpException, HttpStatus } from '@nestjs/common';

export class IncorrectUserAdminPasswordException extends HttpException {
  constructor() {
    super('Provided password is incorrect', HttpStatus.FORBIDDEN);
  }
}
