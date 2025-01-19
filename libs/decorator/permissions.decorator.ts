import { SetMetadata } from '@nestjs/common';
import { PermissionsEnum } from 'src/permissions/permissions.enum';

export const Permission = (permission: PermissionsEnum | PermissionsEnum[]) => {
  return SetMetadata('permission', permission);
};
