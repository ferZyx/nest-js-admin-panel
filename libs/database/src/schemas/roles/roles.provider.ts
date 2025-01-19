import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { RolesSchema, RolesSchemaClass } from './roles.schema';
import { mongoosepaginatev2 } from 'libs/database/src/plugins';

export const RolesProvider = {
  provide: RolesSchemaClass.name,
  useFactory: (connection: Connection) => {
    const schema = RolesSchema;
    schema.plugin(mongoosepaginatev2);
    return connection.model(RolesSchemaClass.name, schema);
  },
  inject: [getConnectionToken()],
};
