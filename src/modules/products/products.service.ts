import { Injectable, NotFoundException } from "@nestjs/common"

import { PrismaService } from "src/prisma/prisma.service"

import { CategoriesService } from "@modules/categories/categories.service"

import { CreateProductDto } from "./dto/create-product.dto"
import { UpdateProductDto } from "./dto/update-product.dto"
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
      data: createProductDto,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            parentId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  findAll(): Promise<ProductEntity[]> {
    return this.prisma.product.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            parentId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })
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
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            parentId: true,
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
    await this.findOneById(id)

    return this.prisma.product.update({
      where: {
        id,
        deletedAt: null,
      },
      data: updateProductDto,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            parentId: true,
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
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            parentId: true,
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
