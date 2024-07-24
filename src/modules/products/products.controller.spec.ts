import { Test, TestingModule } from "@nestjs/testing"

import { CreateProductDto } from "./dto/create-product.dto"
import { UpdateProductDto } from "./dto/update-product.dto"
import { ProductEntity } from "./entities/product.entity"
import { ProductsController } from "./products.controller"
import { ProductsService } from "./products.service"

describe("ProductsController", () => {
  let controller: ProductsController
  let service: ProductsService

  const mockProduct: ProductEntity = {
    id: "1",
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
    categoryId: "2",
    category: {
      id: "2",
      name: "Test Category",
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockProductsService = {
    create: jest.fn().mockResolvedValue(mockProduct),
    findAll: jest.fn().mockResolvedValue([mockProduct]),
    findOneById: jest.fn().mockResolvedValue(mockProduct),
    update: jest.fn().mockResolvedValue(mockProduct),
    remove: jest.fn().mockResolvedValue(mockProduct),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile()

    controller = module.get<ProductsController>(ProductsController)
    service = module.get<ProductsService>(ProductsService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("create", () => {
    it("should create a product", async () => {
      const createProductDto: CreateProductDto = {
        name: "Test Product",
        description: "Test Description",
        price: 100,
        stock: 10,
        categoryId: "2",
      }
      const result = await controller.create(createProductDto)
      expect(result).toEqual(mockProduct)
      expect(service.create).toHaveBeenCalledWith(createProductDto)
    })
  })

  describe("findAll", () => {
    it("should return an array of products", async () => {
      const result = await controller.findAll()
      expect(result).toEqual([mockProduct])
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe("findOne", () => {
    it("should return a single product", async () => {
      const result = await controller.findOne("1")
      expect(result).toEqual(mockProduct)
      expect(service.findOneById).toHaveBeenCalledWith("1")
    })
  })

  describe("update", () => {
    it("should update a product", async () => {
      const updateProductDto: UpdateProductDto = {
        name: "Updated Product",
        description: "Updated Description",
        price: 150,
        stock: 5,
      }
      const result = await controller.update("1", updateProductDto)
      expect(result).toEqual(mockProduct)
      expect(service.update).toHaveBeenCalledWith("1", updateProductDto)
    })
  })

  describe("remove", () => {
    it("should remove a product", async () => {
      const result = await controller.remove("1")
      expect(result).toEqual(mockProduct)
      expect(service.remove).toHaveBeenCalledWith("1")
    })
  })
})
