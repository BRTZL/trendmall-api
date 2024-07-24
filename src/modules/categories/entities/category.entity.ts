import { ApiProperty } from "@nestjs/swagger"

import { Category as CategoryModel } from "@prisma/client"

export class CategoryEntity implements Omit<CategoryModel, "deletedAt"> {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  parentId: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
