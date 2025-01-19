import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [collection, field = 'id'] = args.constraints;

    if (!value || !field) return false;

    const record = await this.connection.collection(collection).findOne({
      [field]: value,
    });

    if (record === null) return true;

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} entered is already taken`;
  }
}

export function Unique(
  model: string,
  uniqueField: string,
  exceptField: string | null = null,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, uniqueField, exceptField],
      validator: UniqueConstraint,
    });
  };
}
