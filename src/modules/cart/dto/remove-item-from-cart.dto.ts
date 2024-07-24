import { ApiProperty } from "@nestjs/swagger"

import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from "class-validator"

export class RemoveItemFromCartDto {
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
