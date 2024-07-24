import { ApiProperty } from "@nestjs/swagger"

import { CartItem as CartItemModel } from "@prisma/client"

import { ProductEntity } from "@modules/products/entities/product.entity"

export class CartItemEntity
  implements Omit<CartItemModel, "userId" | "productId">
{
  @ApiProperty()
  id: string

  @ApiProperty()
  quantity: number

  @ApiProperty({
    type: ProductEntity,
  })
  product: ProductEntity

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
