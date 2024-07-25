import { ApiProperty } from "@nestjs/swagger"

import { IsNotEmpty, IsString, IsUUID } from "class-validator"

export class CreateOrderDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  addressId: string
}
