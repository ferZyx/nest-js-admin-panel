import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsMemoryStorageFile(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsMemoryStorageFile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [propertyName],
      options: validationOptions,
      validator: {
        defaultMessage: (v) => `${v?.property} should be a file`,
        validate(value: any) {
          if (Array.isArray(value)) {
            return value.every(
              (v) =>
                'buffer' in v &&
                v.buffer instanceof Buffer &&
                'mimetype' in v &&
                'fieldname' in v,
            );
          } else if (
            typeof value == 'object' &&
            'buffer' in value &&
            value.buffer instanceof Buffer &&
            'mimetype' in value &&
            'fieldname' in value
          ) {
            return true;
          }

          return false;
        },
      },
    });
  };
}
