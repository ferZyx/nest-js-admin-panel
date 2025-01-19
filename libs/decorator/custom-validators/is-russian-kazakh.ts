import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

export function isOnlyRussianOrKazakh(
  text: string,
  skip: string[] = [],
): boolean {
  const regex = //;
    new RegExp(`^[а-яіёәғқңөұүһА-ЯІЁӘҒҚҢӨҰҮҺ${skip.join('')}]+$`, 'gi');
  return regex.test(text.trim());
}

@ValidatorConstraint({ name: 'RussianKazakh', async: false })
@Injectable()
export class RussianKazakh implements ValidatorConstraintInterface {
  constructor() {}

  async validate(
    value: string | null,
    args: ValidationArguments,
  ): Promise<boolean> {
    if (!value) {
      return false;
    }
    const [skip] = args.constraints;

    return isOnlyRussianOrKazakh(value, skip ?? []);
  }
}

export function IsRussianKazakh(
  validationOptions?: ValidationOptions,
  skipSymbols: string[] = [],
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [skipSymbols],
      validator: RussianKazakh,
    });
  };
}
