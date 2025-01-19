import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidMongoIdException extends HttpException {
  constructor() {
    super('Invalid Mongo Id provided', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
