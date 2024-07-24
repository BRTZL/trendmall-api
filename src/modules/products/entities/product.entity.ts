import { ApiProperty } from "@nestjs/swagger"

import { Product as ProductModel } from "@prisma/client"

import { CategoryEntity } from "@modules/categories/entities/category.entity"

export class ProductEntity implements Omit<ProductModel, "deletedAt"> {
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

  @ApiProperty()
  categoryId: string

  @ApiProperty({
    type: CategoryEntity,
  })
  category: CategoryEntity

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
