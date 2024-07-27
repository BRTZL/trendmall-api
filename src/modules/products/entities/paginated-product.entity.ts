import { ApiProperty } from "@nestjs/swagger"

import { ProductEntity } from "./product.entity"

export class PaginationProductEntity {
  @ApiProperty()
  page: number

  @ApiProperty()
  limit: number

  @ApiProperty()
  skip: number

  @ApiProperty()
  total: number

  @ApiProperty({
    type: ProductEntity,
    isArray: true,
  })
  data: ProductEntity[]
}
