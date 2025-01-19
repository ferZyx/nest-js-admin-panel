import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiPaginated,
  PaginateQuery,
} from 'libs/decorator/api-paginated.decorator';
import { Lean } from 'libs/decorator/lean.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Permission } from 'libs/decorator/permissions.decorator';
import { PermissionsEnum } from '../permissions/permissions.enum';
import { MessageResponseDto } from 'libs/dto/message.response.dto';
import { FilialsService } from './filials.service';
import { CreateFilialDto } from './dto/requests/create-filial.dto';
import { UpdateFilialDto } from './dto/requests/update-filial.dto';
import { FilialDto } from './dto/responses/filial.dto';

@Controller('filials')
@ApiTags('filials')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: MessageResponseDto })
export class FilialsController {
  constructor(private readonly filialsService: FilialsService) {}

  @Get()
  @ApiPaginated(FilialDto)
  @Permission(PermissionsEnum.GET_FILIALS)
  async getFilials(@Query() query: PaginateQuery) {
    return this.filialsService.getFilials(query);
  }

  @Post()
  @Lean(FilialDto)
  @Permission(PermissionsEnum.CREATE_FILIAL)
  createFilial(@Body() createFilialDto: CreateFilialDto) {
    return this.filialsService.create(createFilialDto);
  }

  @Put(':id')
  @Lean(FilialDto)
  @Permission(PermissionsEnum.UPDATE_FILIAL)
  @ApiParam({ type: String, name: 'id' })
  updateFilial(
    @Param('id') filialId: string,
    @Body() updateFilialDto: UpdateFilialDto,
  ) {
    return this.filialsService.update(filialId, updateFilialDto);
  }

  @Delete(':id')
  @Permission(PermissionsEnum.DELETE_FILIAL)
  @ApiParam({ type: String, name: 'id' })
  async deleteFilial(@Param('id') filialId: Types.ObjectId) {
    await this.filialsService.delete(filialId);
  }
}
