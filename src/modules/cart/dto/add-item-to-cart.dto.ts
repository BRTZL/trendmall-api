import { ApiProperty } from "@nestjs/swagger"

import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from "class-validator"

export class AddItemToCartDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  quantity: number

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  productId: string
}
