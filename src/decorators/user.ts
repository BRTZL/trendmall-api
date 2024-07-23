import { createParamDecorator, ExecutionContext } from "@nestjs/common"

import { User as PrismaUser } from "@prisma/client"

type UserWithoutPassword = Omit<PrismaUser, "password">

export const User = createParamDecorator(
  (
    data: keyof UserWithoutPassword,
    ctx: ExecutionContext
  ): UserWithoutPassword => {
    const request = ctx.switchToHttp().getRequest()

    return data ? request.user[data] : request.user
  }
)
