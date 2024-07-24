import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger"

import { Public } from "@decorators/public"
import { Roles } from "@decorators/roles"

import { CreateProductDto } from "./dto/create-product.dto"
import { UpdateProductDto } from "./dto/update-product.dto"
import { ProductEntity } from "./entities/product.entity"
import { ProductsService } from "./products.service"

@Controller("products")
@ApiTags("Products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles("ADMIN")
  @ApiOkResponse({ type: ProductEntity })
  @ApiBody({ type: CreateProductDto })
  @ApiBearerAuth()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @Get()
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  @Public()
  findAll() {
    return this.productsService.findAll()
  }

  @Get(":id")
  @ApiOkResponse({ type: ProductEntity })
  @Public()
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.productsService.findOneById(id)
  }

  @Patch(":id")
  @Roles("ADMIN")
  @ApiOkResponse({ type: ProductEntity })
  @ApiBody({ type: UpdateProductDto })
  @ApiBearerAuth()
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, updateProductDto)
  }

  @Delete(":id")
  @Roles("ADMIN")
  @ApiOkResponse({ type: ProductEntity })
  @ApiBearerAuth()
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.productsService.remove(id)
  }
}
