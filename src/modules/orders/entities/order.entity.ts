import { ApiProperty } from "@nestjs/swagger"

import { Order, OrderItem, OrderStatus } from "@prisma/client"

import { AddressEntity } from "@modules/addresses/entities/address.entity"
import { ProductEntity } from "@modules/products/entities/product.entity"

export class OrderItemEntity
  implements Omit<OrderItem, "orderId" | "productId" | "deletedAt">
{
  @ApiProperty()
  id: string

  @ApiProperty()
  quantity: number

  @ApiProperty()
  price: number

  @ApiProperty({
    type: ProductEntity,
  })
  product: ProductEntity

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

export class OrderEntity
  implements Omit<Order, "addressId" | "userId" | "deletedAt">
{
  @ApiProperty()
  id: string

  @ApiProperty()
  total: number

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus

  @ApiProperty({
    type: OrderItemEntity,
    isArray: true,
  })
  items: OrderItemEntity[]

  @ApiProperty({ type: AddressEntity })
  address: AddressEntity

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
