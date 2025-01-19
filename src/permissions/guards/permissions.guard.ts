import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '../permissions.service';
import { PermissionsEnum } from '../permissions.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get<PermissionsEnum | PermissionsEnum[]>(
      'permission',
      context.getHandler(),
    );

    if (!permission) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userPermissions = await this.permissionsService.getUserPermissions(
      user['_id'],
    );
    if (Array.isArray(permission)) {
      const missingPermissions = permission.filter(
        (x) => !userPermissions.includes(x),
      );
      const hasPersmission = permission.some((x) =>
        userPermissions.includes(x),
      );

      if (!hasPersmission && missingPermissions.length > 0) {
        throw new ForbiddenException(
          `Недостаточно прав у пользователя. Отсутствуют: ${missingPermissions.join(
            ', ',
          )}`,
        );
      }
    } else if (!userPermissions.includes(permission)) {
      throw new ForbiddenException(
        `Недостаточно прав у пользователя. Отсутствуют : ${permission}`,
      );
    }

    return true;
  }
}
