import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export type PaginationResult = {
  page: number
  limit: number
  skip: number
}

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationResult => {
    const request = ctx.switchToHttp().getRequest()
    const query = request.query

    // Extract pagination parameters
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10
    const skip = (page - 1) * limit

    return { page, limit, skip }
  }
)
