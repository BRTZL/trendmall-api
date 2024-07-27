import { createParamDecorator, ExecutionContext } from "@nestjs/common"

type ProductFilterRecord = {
  query?: string
  inStock?: boolean
  categoryId?: string[]
}

export type ProductPaginationResult = {
  page: number
  limit: number
  skip: number
  filters: ProductFilterRecord
}

export const ProductPagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ProductPaginationResult => {
    const request = ctx.switchToHttp().getRequest()
    const query = request.query

    // Extract pagination parameters
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10
    const skip = (page - 1) * limit

    // Extract dynamic filters
    const filters: ProductFilterRecord = {}

    if (query.query && typeof query.query === "string") {
      filters.query = query.query
    }

    if (query.inStock && typeof query.inStock === "boolean") {
      filters.inStock = query.inStock
    }

    if (query.categoryId) {
      if (typeof query.categoryId === "string") {
        filters.categoryId = query.categoryId.split(",")
      } else if (Array.isArray(query.categoryId)) {
        filters.categoryId = query.categoryId
      }
    }

    return { page, limit, skip, filters }
  }
)
