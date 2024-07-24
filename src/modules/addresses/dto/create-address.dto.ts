import { ApiProperty } from "@nestjs/swagger"

import { IsNotEmpty, IsString } from "class-validator"

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullName: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  state: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  zipCode: string
}
