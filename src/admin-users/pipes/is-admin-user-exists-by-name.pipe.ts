import { PipeTransform, Injectable, Scope } from '@nestjs/common';
import { AdminUsersService } from '../admin-users.service';
import { AdminUserDoesNotExistException } from '../exceptions/admin-user-not-found.exception';

@Injectable({ scope: Scope.REQUEST })
export class IsAdminUserExistsByUsernamePipe implements PipeTransform {
  constructor(private adminUsersService: AdminUsersService) {}

  async transform(value: string) {
    const user = await this.adminUsersService.findOneByUsername(value);

    if (!user) {
      throw new AdminUserDoesNotExistException();
    }

    return user;
  }
}
