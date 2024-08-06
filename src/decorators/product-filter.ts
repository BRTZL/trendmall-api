import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export type ProductFilterResult = {
  query?: string
  inStock?: boolean
  categoryIds?: string[]
}

export const ProductFilter = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ProductFilterResult => {
    const request = ctx.switchToHttp().getRequest()
    const query = request.query

    const filters: ProductFilterResult = {}

    if (query.query && typeof query.query === "string") {
      filters.query = query.query
    }

    if (query.inStock) {
      filters.inStock = query.inStock === "true"
    }

    if (query.categoryId) {
      if (typeof query.categoryId === "string") {
        filters.categoryIds = query.categoryId.split(",")
      } else if (Array.isArray(query.categoryId)) {
        filters.categoryIds = query.categoryId
      }
    }

    return filters
  }
)
