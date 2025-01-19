import { PipeTransform, Injectable, Scope, Inject } from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { InvalidMongoIdException } from 'libs/exceptions/invalid-mongo-id.exceptions';
import { RoleDoesNotExistException } from '../exceptions/role-not-found.exception';
import {
  RolesDbModel,
  RolesSchemaClass,
} from '@libs/database/schemas/roles/roles.schema';

@Injectable({ scope: Scope.REQUEST })
export class RoleExistsByIdPipe implements PipeTransform {
  constructor(
    @Inject(RolesSchemaClass.name)
    public readonly roles: PaginateModel<RolesDbModel>,
  ) {}

  async transform(value: string) {
    if (!isMongoId(value)) {
      throw new InvalidMongoIdException();
    }

    const role = await this.roles.findById(value);

    if (!role) {
      throw new RoleDoesNotExistException();
    }

    return role;
  }
}
