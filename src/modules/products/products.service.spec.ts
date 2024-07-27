import { Test, TestingModule } from "@nestjs/testing"

import { PrismaService } from "src/prisma/prisma.service"

import { CategoriesService } from "@modules/categories/categories.service"

import { CreateProductDto } from "./dto/create-product.dto"
import { UpdateProductDto } from "./dto/update-product.dto"
import { PaginationProductEntity } from "./entities/paginated-product.entity"
import { ProductEntity } from "./entities/product.entity"
import { ProductsService } from "./products.service"

const mockPrismaService = {
  product: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
}

const mockCategoriesService = {
  findOneById: jest.fn(),
}

const product: ProductEntity = {
  id: "1",
  name: "Test Product",
  description: "Test Description",
  price: 100,
  stock: 10,
  category: {
    id: "2",
    name: "Test Category",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  images: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe("ProductsService", () => {
  let service: ProductsService
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CategoriesService, useValue: mockCategoriesService },
      ],
    }).compile()

    service = module.get<ProductsService>(ProductsService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("create", () => {
    it("should create a product", async () => {
      const createProductDto: CreateProductDto = {
        name: "Test Product",
        description: "Test Description",
        price: 100,
        stock: 10,
        categoryId: "2",
        images: [],
      }

      const result: ProductEntity = {
        id: "1",
        ...createProductDto,
        category: {
          id: "2",
          name: "Test Category",
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaService.product.create.mockResolvedValue(result)

      expect(await service.create(createProductDto)).toEqual(result)
      expect(prisma.product.create).toHaveBeenCalled()
    })
  })

  describe("findAll", () => {
    it("should return an array of products", async () => {
      const result: PaginationProductEntity = {
        page: 1,
        limit: 10,
        skip: 0,
        total: 1,
        data: [product],
      }

      mockPrismaService.product.findMany.mockResolvedValue([product])
      mockPrismaService.product.count.mockResolvedValue(result.total)

      expect(
        await service.findAll({
          page: 1,
          limit: 10,
          skip: 0,
          filters: {},
        })
      ).toEqual(result)
      expect(mockPrismaService.product.findMany).toHaveBeenCalled()
    })
  })

  describe("findOneById", () => {
    it("should return a single product", async () => {
      const result: ProductEntity = product

      mockPrismaService.product.findUnique.mockResolvedValue(result)

      expect(await service.findOneById("1")).toEqual(result)
      expect(mockPrismaService.product.findUnique).toHaveBeenCalled()
    })
  })

  describe("update", () => {
    it("should update a product", async () => {
      const updateProductDto: UpdateProductDto = {
        name: "Updated Product",
        description: "Updated Description",
        price: 150,
        stock: 5,
        images: [],
      }

      const result = {
        ...product,
        ...updateProductDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaService.product.findUnique.mockResolvedValue(result)
      mockPrismaService.product.update.mockResolvedValue(result)

      expect(await service.update("1", updateProductDto)).toEqual(result)
      expect(mockPrismaService.product.update).toHaveBeenCalled()
    })
  })

  describe("remove", () => {
    it("should soft delete a product", async () => {
      const result: ProductEntity = product

      mockPrismaService.product.findUnique.mockResolvedValue(result)
      mockPrismaService.product.update.mockResolvedValue(result)

      expect(await service.remove("1")).toEqual(result)
      expect(mockPrismaService.product.update).toHaveBeenCalled()
    })
  })
})
