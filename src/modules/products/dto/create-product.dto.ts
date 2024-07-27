import { ApiProperty } from "@nestjs/swagger"

import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from "class-validator"

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty()
  price: number

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty()
  stock: number

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  categoryId: string

  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  images: string[]
}
