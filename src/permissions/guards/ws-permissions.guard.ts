import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '../permissions.service';
import { PermissionsEnum } from '../permissions.enum';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsPermissionsGuard implements CanActivate {
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

    const client = context.switchToWs().getClient();
    const { user } = client;
    if (!user) {
      throw new WsException('User not found');
    }

    const userPermissions = await this.permissionsService.getUserPermissions(
      user['_id'],
    );

    if (Array.isArray(permission)) {
      const missingPermissions = permission.filter(
        (x) => !userPermissions.includes(x),
      );
      const hasPermission = permission.some((x) => userPermissions.includes(x));

      if (!hasPermission && missingPermissions.length > 0) {
        throw new WsException(
          `Недостаточно прав у пользователя. Отсутствуют: ${missingPermissions.join(
            ', ',
          )}`,
        );
      }
    } else if (!userPermissions.includes(permission)) {
      throw new WsException(
        `Недостаточно прав у пользователя. Отсутствуют: ${permission}`,
      );
    }

    return true;
  }
}
