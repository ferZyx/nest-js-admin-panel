import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function ToBoolean() {
  return applyDecorators(
    Transform(({ obj, key }) => {
      return obj[key] === 'true' || obj[key] === true || obj[key] === 1;
    }),
  );
}
