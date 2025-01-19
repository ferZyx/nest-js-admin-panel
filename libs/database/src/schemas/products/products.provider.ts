import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { mongoosepaginatev2 } from 'libs/database/src/plugins';
import { ProductsSchema, ProductsSchemaClass } from './products.schema';

export const ProductsProvider = {
  provide: ProductsSchemaClass.name,
  useFactory: (connection: Connection) => {
    const schema = ProductsSchema;
    schema.plugin(mongoosepaginatev2);
    return connection.model(ProductsSchemaClass.name, schema);
  },
  inject: [getConnectionToken()],
};
