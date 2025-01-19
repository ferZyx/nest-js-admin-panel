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
import { ProductPaginateQueryDto } from './dto/product-paginate-query.dto';
@Controller('products')
@ApiTags('products')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: MessageResponseDto })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiPaginated(ProductDto)
  @Permission(PermissionsEnum.GET_PRODUCTS)
  async getProducts(@Query() query: ProductPaginateQueryDto) {
    return this.productsService.getProducts(query);
  }

  @Post('/many')
  @ApiPaginated(ProductDto)
  @Permission(PermissionsEnum.CREATE_PRODUCT)
  async createManyProducts(@Body() createProductDto: CreateProductDto[]) {
    return this.productsService.createMany(createProductDto);
  }

  @Post()
  @Lean(ProductDto)
  @Permission(PermissionsEnum.CREATE_PRODUCT)
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @Lean(ProductDto)
  @Permission(PermissionsEnum.UPDATE_PRODUCT)
  @ApiParam({ type: String, name: 'id' })
  updateProduct(
    @Param('id') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(productId, updateProductDto);
  }

  @Delete(':id')
  @Permission(PermissionsEnum.DELETE_PRODUCT)
  @ApiParam({ type: String, name: 'id' })
  async deleteProduct(@Param('id') productId: string) {
    await this.productsService.delete(productId);
  }

  @Post('/recover/:id')
  @Permission(PermissionsEnum.RECOVER_PRODUCT)
  async recoverAdminProduct(@Param('id') productId: string) {
    await this.productsService.recoverProduct(productId);
  }
}
