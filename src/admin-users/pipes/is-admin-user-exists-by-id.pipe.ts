import { PipeTransform, Injectable, Scope } from '@nestjs/common';
import { AdminUsersService } from '../admin-users.service';
import { AdminUserDoesNotExistException } from '../exceptions/admin-user-not-found.exception';
import { isMongoId } from 'class-validator';
import { InvalidMongoIdException } from 'libs/exceptions/invalid-mongo-id.exceptions';
import { Types } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class IsAdminUserExistsByIdPipe implements PipeTransform {
  constructor(private adminUsersService: AdminUsersService) {}

  async transform(value: Types.ObjectId) {
    if (!isMongoId(value)) {
      throw new InvalidMongoIdException();
    }

    const user = await this.adminUsersService.findOneById(value);

    if (!user) {
      throw new AdminUserDoesNotExistException();
    }

    return user;
  }
}
