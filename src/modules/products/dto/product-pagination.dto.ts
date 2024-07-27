import { ApiProperty } from "@nestjs/swagger"

import { IsNumber } from "class-validator"

export class ProductPaginationDto {
  @IsNumber()
  @ApiProperty({
    default: 1,
  })
  page: number

  @IsNumber()
  @ApiProperty({
    default: 20,
  })
  limit: number

  @ApiProperty({
    type: String,
    required: false,
  })
  query?: string

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  inStock?: boolean

  @ApiProperty({
    type: String,
    required: false,
  })
  categoryId?: string
}
