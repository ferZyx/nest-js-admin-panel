import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { Allow } from 'class-validator';

export function ToObjectId() {
  return applyDecorators(
    Transform(({ obj, key }) => {
      const value = obj[key];

      if (Array.isArray(value)) {
        if (value.some((v) => !Types.ObjectId.isValid(String(v)))) {
          throw new Error(`Invalid ObjectId: ${value}`);
        }
        return value.map((v) => new Types.ObjectId(String(v)));
      }

      if (!Types.ObjectId.isValid(String(value))) {
        throw new Error(`Invalid ObjectId: ${value}`);
      }
      return new Types.ObjectId(String(value));
    }),
    Allow(),
  );
}
