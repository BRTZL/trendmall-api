import { ApiProperty } from "@nestjs/swagger"

import { Address as AddressModel } from "@prisma/client"

export class AddressEntity
  implements Omit<AddressModel, "userId" | "deletedAt">
{
  @ApiProperty()
  id: string

  @ApiProperty()
  fullName: string

  @ApiProperty()
  address: string

  @ApiProperty()
  city: string

  @ApiProperty()
  state: string

  @ApiProperty()
  zipCode: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
