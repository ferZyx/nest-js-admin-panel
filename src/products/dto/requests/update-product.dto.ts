import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { IsExists } from 'libs/decorator/custom-validators/is-exists.decorator';
import { Types } from 'mongoose';
import { ToObjectId } from '../../../../libs/decorator/to_objectid';
import { FilialsSchema } from '@libs/database/schemas/filials/filials.schema';

export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @ToObjectId()
  @IsExists(FilialsSchema.get('collection')!, '_id')
  @IsMongoId()
  filialId: Types.ObjectId;
}
