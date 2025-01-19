import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Connection, Types } from 'mongoose';

@ValidatorConstraint({ name: 'IsExists', async: true })
@Injectable()
export class IsExistsConstraint implements ValidatorConstraintInterface {
  errorValue: string;

  constructor(@InjectConnection() private readonly connection: Connection) {}
  async validate(value: any, args: ValidationArguments) {
    const [collectionName, fieldName] = args.constraints;

    if (!collectionName) {
      throw new InternalServerErrorException(
        'Provided incorrect collection name',
      );
    }

    if (fieldName === 'id' || fieldName === '_id') {
      value = new Types.ObjectId(value);
    }

    const record = await this.connection.collection(collectionName).findOne({
      [fieldName]: value,
    });

    if (record) {
      return true;
    } else {
      this.errorValue = value;
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [collectionName, fieldName] = args.constraints;
    return `Record with ${fieldName}=${this.errorValue} not found in ${collectionName}`;
  }
}

export function IsExists(
  collectionName: string | undefined,
  fieldName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [collectionName, fieldName],
      validator: IsExistsConstraint,
    });
  };
}
