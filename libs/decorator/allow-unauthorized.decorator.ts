import { SetMetadata } from '@nestjs/common';

export const ExcludeFromAuthGuard = () =>
  SetMetadata('excludeFromAuthGuard', true);
