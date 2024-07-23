import { ApiProperty } from "@nestjs/swagger"

import { User as UserModel } from "@prisma/client"
import { IsOptional, IsPhoneNumber, IsString } from "class-validator"

export class UpdateUserDto
  implements Pick<UserModel, "fullName" | "phoneNumber">
{
  @IsOptional()
  @IsString()
  @ApiProperty()
  fullName: string

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string
}
