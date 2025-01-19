import * as mongoosepaginatev2 from 'mongoose-paginate-v2';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as mongooseaggregatepaginatev2 from 'mongoose-aggregate-paginate-v2';
import { AutoIncrementID } from '@typegoose/auto-increment';

mongoosepaginatev2.paginate.options = {
  limit: 10,
  lean: true,
};

const mongooseAutoIncrement = AutoIncrementID;

export {
  mongoosepaginatev2,
  mongooseaggregatepaginatev2,
  mongooseAutoIncrement,
};
