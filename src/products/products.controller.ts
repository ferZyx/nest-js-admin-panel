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
import { ApiPaginated } from 'libs/decorator/api-paginated.decorator';
import { Lean } from 'libs/decorator/lean.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Permission } from 'libs/decorator/permissions.decorator';
import { PermissionsEnum } from '../permissions/permissions.enum';
import { MessageResponseDto } from 'libs/dto/message.response.dto';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/responses/product.dto';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { UserPaginateQueryDto } from 'src/admin-users/dto/user-paginate-query.dto';
import { CurrentUser } from 'libs/decorator/current-user.decorator';
import { AdminUserTokenPayload } from 'src/auth/dto/admin-user-token-payload.dto';
@Controller('products')
@ApiTags('products')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: MessageResponseDto })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiPaginated(ProductDto)
  @Permission(PermissionsEnum.GET_PRODUCTS)
  async getUsers(
    @Query() query: UserPaginateQueryDto,
    @CurrentUser() adminUser: AdminUserTokenPayload,
  ) {
    return adminUser.is_admin
      ? this.productsService.getUsers(query)
      : this.productsService.getUsers(query, adminUser._id);
  }

  @Post('/many')
  @ApiPaginated(ProductDto)
  @Permission(PermissionsEnum.CREATE_PRODUCT)
  async createManyUsers(@Body() createUserDto: CreateProductDto[]) {
    return this.productsService.createMany(createUserDto);
  }

  @Post()
  @Lean(ProductDto)
  @Permission(PermissionsEnum.CREATE_PRODUCT)
  createUser(@Body() createUserDto: CreateProductDto) {
    return this.productsService.create(createUserDto);
  }

  @Put(':id')
  @Lean(ProductDto)
  @Permission(PermissionsEnum.UPDATE_PRODUCT)
  @ApiParam({ type: String, name: 'id' })
  updateUser(
    @Param('id') productId: string,
    @Body() updateUserDto: UpdateProductDto,
  ) {
    return this.productsService.update(productId, updateUserDto);
  }

  @Delete(':id')
  @Permission(PermissionsEnum.DELETE_PRODUCT)
  @ApiParam({ type: String, name: 'id' })
  async deleteUser(@Param('id') productId: string) {
    await this.productsService.delete(productId);
  }

  @Post('/recover/:id')
  @Permission(PermissionsEnum.RECOVER_PRODUCT)
  async recoverAdminUser(@Param('id') productId: string) {
    await this.productsService.recoverUser(productId);
  }
}
