import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { mongoosepaginatev2 } from 'libs/database/src/plugins';
import {
  FilialsSchema,
  FilialsSchemaClass,
} from '@libs/database/schemas/filials/filials.schema';

export const FilialsProvider = {
  provide: FilialsSchemaClass.name,
  useFactory: (connection: Connection) => {
    const schema = FilialsSchema;
    schema.plugin(mongoosepaginatev2);
    return connection.model(FilialsSchemaClass.name, schema);
  },
  inject: [getConnectionToken()],
};
