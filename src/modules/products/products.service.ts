import { Injectable, NotFoundException } from "@nestjs/common"

import { Prisma } from "@prisma/client"

import { PrismaService } from "src/prisma/prisma.service"

import { CategoriesService } from "@modules/categories/categories.service"

import { ProductPaginationResult } from "@decorators/pagination"

import { CreateProductDto } from "./dto/create-product.dto"
import { UpdateProductDto } from "./dto/update-product.dto"
import { PaginationProductEntity } from "./entities/paginated-product.entity"
import { ProductEntity } from "./entities/product.entity"

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoriesService: CategoriesService
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    await this.categoriesService.findOneById(createProductDto.categoryId)

    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
        category: {
          connect: {
            id: createProductDto.categoryId,
          },
        },
        images: {
          createMany: {
            data: createProductDto.images.map((url) => ({
              url,
            })),
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
            parentId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async findAll(
    pagination: ProductPaginationResult
  ): Promise<PaginationProductEntity> {
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      stock: pagination.filters.inStock
        ? {
            gt: 0,
          }
        : undefined,
      categoryId: pagination.filters.categoryId
        ? {
            in: pagination.filters.categoryId,
          }
        : undefined,
      OR: pagination.filters.query
        ? [
            {
              name: {
                contains: pagination.filters.query,
              },
            },
            {
              description: {
                contains: pagination.filters.query,
              },
            },
          ]
        : undefined,
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({
        where,
      }),
      this.prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          stock: true,
          category: {
            select: {
              id: true,
              name: true,
              parentId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          images: {
            select: {
              id: true,
              url: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        take: pagination.limit,
        skip: pagination.skip,
      }),
    ])

    return {
      page: pagination.page,
      limit: pagination.limit,
      skip: pagination.skip,
      total: total,
      data: products,
    }
  }

  async findOneById(id: string): Promise<ProductEntity> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
            parentId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!product) {
      throw new NotFoundException("Product not found")
    }

    return product
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<ProductEntity> {
    const product = await this.findOneById(id)

    const addedImages = updateProductDto.images.filter(
      (url) => !product.images.find((p) => p.url === url)
    )
    const removedImages = product.images.filter(
      (image) => !updateProductDto.images.find((url) => url === image.url)
    )

    return this.prisma.product.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        name: updateProductDto.name,
        description: updateProductDto.description,
        price: updateProductDto.price,
        stock: updateProductDto.stock,
        category: {
          connect: {
            id: updateProductDto.categoryId,
          },
        },
        images: {
          createMany: {
            data: addedImages.map((url) => ({
              url,
            })),
          },
          deleteMany: removedImages.map((image) => ({
            id: image.id,
          })),
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
            parentId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async remove(id: string): Promise<ProductEntity> {
    await this.findOneById(id)

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
            parentId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })
  }
}
