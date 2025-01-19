import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AdminUserSchema, AdminUserSchemaClass } from './admin-users.schema';
import { mongoosepaginatev2 } from 'libs/database/src/plugins';

export const AdminUsersProvider = {
  provide: AdminUserSchemaClass.name,
  useFactory: (connection: Connection) => {
    const schema = AdminUserSchema;
    schema.plugin(mongoosepaginatev2);
    return connection.model(AdminUserSchemaClass.name, schema);
  },
  inject: [getConnectionToken()],
};
