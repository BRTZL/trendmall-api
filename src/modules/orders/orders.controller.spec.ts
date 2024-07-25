import { Test, TestingModule } from "@nestjs/testing"

import { CreateOrderDto } from "./dto/create-order.dto"
import { OrderEntity } from "./entities/order.entity"
import { OrdersController } from "./orders.controller"
import { OrdersService } from "./orders.service"

const mockOrdersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOneById: jest.fn(),
}

const mockOrderResponse: OrderEntity = {
  id: "order-id-1",
  total: 500,
  status: "PENDING",
  items: [
    {
      id: "order-item-id-1",
      quantity: 2,
      price: 250,
      product: {
        id: "product-id-1",
        name: "Mock Product",
        description: "Mock Product Description",
        price: 250,
        stock: 10,
        category: {
          id: "category-id-1",
          name: "Mock Category",
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  address: {
    id: "address-id-1",
    fullName: "John Doe",
    address: "123 Mock St",
    city: "Mock City",
    state: "Mock State",
    zipCode: "12345",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe("OrdersController", () => {
  let controller: OrdersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: mockOrdersService }],
    }).compile()

    controller = module.get<OrdersController>(OrdersController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("checkout", () => {
    it("should create an order", async () => {
      const userId = "user1"
      const createOrderDto: CreateOrderDto = { addressId: "address-id-1" }

      mockOrdersService.create.mockResolvedValue(mockOrderResponse)

      const result = await controller.checkout(userId, createOrderDto)
      expect(result).toEqual(mockOrderResponse)
      expect(mockOrdersService.create).toHaveBeenCalledWith(
        userId,
        createOrderDto
      )
    })
  })

  describe("findAll", () => {
    it("should return an array of orders", async () => {
      const userId = "user1"
      const orders = [mockOrderResponse]

      mockOrdersService.findAll.mockResolvedValue(orders)

      const result = await controller.findAll(userId)
      expect(result).toEqual(orders)
      expect(mockOrdersService.findAll).toHaveBeenCalledWith(userId)
    })
  })

  describe("findOne", () => {
    it("should return a single order", async () => {
      const userId = "user1"
      const orderId = "order-id-1"

      mockOrdersService.findOneById.mockResolvedValue(mockOrderResponse)

      const result = await controller.findOne(userId, orderId)
      expect(result).toEqual(mockOrderResponse)
      expect(mockOrdersService.findOneById).toHaveBeenCalledWith(
        userId,
        orderId
      )
    })
  })
})
