import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

function parsePhone(v: string): string {
  const phone: string = v.match(/\d+/g)?.join('').slice(-10) ?? '';
  return phone;
}

export function ParsePhone() {
  return applyDecorators(Transform(({ value }) => parsePhone(value)));
}
