import { ApiProperty } from "@nestjs/swagger"

import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string

  @IsString()
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  parentId: string
}
