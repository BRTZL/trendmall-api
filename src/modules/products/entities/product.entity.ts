import { ApiProperty } from "@nestjs/swagger"

import {
  ProductImage as ProductImageModel,
  Product as ProductModel,
} from "@prisma/client"

import { CategoryEntity } from "@modules/categories/entities/category.entity"

export class ProductImageEntity
  implements Omit<ProductImageModel, "productId" | "deletedAt">
{
  @ApiProperty()
  id: string

  @ApiProperty()
  url: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

export class ProductEntity
  implements Omit<ProductModel, "categoryId" | "deletedAt">
{
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string

  @ApiProperty()
  price: number

  @ApiProperty()
  stock: number

  @ApiProperty({
    type: CategoryEntity,
  })
  category: CategoryEntity

  @ApiProperty({
    type: ProductImageEntity,
    isArray: true,
  })
  images: ProductImageEntity[]

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
