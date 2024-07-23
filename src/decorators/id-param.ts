import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from "@nestjs/common"

import { isUUID } from "class-validator"

export const IdParam = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const queryParam = request.query[data]

    if (!queryParam || !isUUID(queryParam)) {
      throw new BadRequestException("Invalid UUID format for id parameter")
    }

    return queryParam
  }
)
