import { Module } from "@nestjs/common"

import { CategoriesService } from "@modules/categories/categories.service"

import { ProductsController } from "./products.controller"
import { ProductsService } from "./products.service"

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, CategoriesService],
  exports: [ProductsService],
})
export class ProductsModule {}
