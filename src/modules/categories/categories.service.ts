import { Injectable, NotFoundException } from "@nestjs/common"

import { PrismaService } from "src/prisma/prisma.service"

import { CreateCategoryDto } from "./dto/create-category.dto"
import { UpdateCategoryDto } from "./dto/update-category.dto"
import { CategoryEntity } from "./entities/category.entity"

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    if (createCategoryDto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: {
          id: createCategoryDto.parentId,
          deletedAt: null,
        },
      })

      if (!parent) {
        throw new NotFoundException("Parent category not found")
      }
    }

    return this.prisma.category.create({
      data: createCategoryDto,
      select: {
        id: true,
        name: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  findAll(): Promise<CategoryEntity[]> {
    return this.prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async findOneById(id: string): Promise<CategoryEntity> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!category) {
      throw new NotFoundException("Category not found")
    }

    return category
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryEntity> {
    await this.findOneById(id)

    return this.prisma.category.update({
      where: {
        id,
        deletedAt: null,
      },
      data: updateCategoryDto,
      select: {
        id: true,
        name: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async remove(id: string): Promise<CategoryEntity> {
    await this.findOneById(id)

    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }
}
