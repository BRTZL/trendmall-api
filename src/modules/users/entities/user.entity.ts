import { ApiProperty } from "@nestjs/swagger"

import { User as UserModel } from "@prisma/client"

export class UserEntity
  implements
    Omit<UserModel, "password" | "role" | "emailVerified" | "deletedAt">
{
  @ApiProperty()
  id: string

  @ApiProperty()
  fullName: string

  @ApiProperty()
  email: string

  @ApiProperty()
  phoneNumber: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
