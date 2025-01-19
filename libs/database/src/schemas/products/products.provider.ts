import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { mongoosepaginatev2 } from 'libs/database/src/plugins';
import { ProductsSchema, UsersSchemaClass } from './products.schema';

export const ProductsProvider = {
  provide: UsersSchemaClass.name,
  useFactory: (connection: Connection) => {
    const schema = ProductsSchema;
    schema.plugin(mongoosepaginatev2);
    return connection.model(UsersSchemaClass.name, schema);
  },
  inject: [getConnectionToken()],
};
