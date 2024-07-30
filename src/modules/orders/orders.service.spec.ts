import { NotFoundException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"

import { PrismaService } from "src/prisma/prisma.service"

import { AddressesService } from "@modules/addresses/addresses.service"
import { CartService } from "@modules/cart/cart.service"

import { CreateOrderDto } from "./dto/create-order.dto"
import { OrdersService } from "./orders.service"

const mockPrismaService = {
  order: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  cartItem: {
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn(),
}

const mockCartService = {
  getCart: jest.fn(),
}

const mockAddressesService = {
  findOneById: jest.fn(),
}

const exampleOrderResponse = {
  id: "603d5d06-f580-4dc9-86a7-7a14ded15e72",
  total: 1000,
  status: "PENDING",
  items: [
    {
      id: "6119daae-56bc-40d1-94e3-12956c6bc7f0",
      quantity: 10,
      price: 100,
      product: {
        id: "cc9e6c99-57f9-433a-a3ae-4cd61c1aa128",
        name: "Product 1",
        description: "Test Desc.",
        price: 100,
        stock: 1,
        category: {
          id: "0b7268c2-173e-4dc7-a3a0-d9f41ef83528",
          name: "Category 1",
          parentId: null,
          createdAt: new Date("2024-07-24T00:58:15.121Z"),
          updatedAt: new Date("2024-07-24T00:58:15.121Z"),
        },
        createdAt: new Date("2024-07-24T01:38:31.566Z"),
        updatedAt: new Date("2024-07-24T01:38:31.566Z"),
      },
      createdAt: new Date("2024-07-25T00:44:42.562Z"),
      updatedAt: new Date("2024-07-25T00:44:42.562Z"),
    },
  ],
  address: {
    id: "721433dd-3372-4c13-88fd-7b91de138631",
    fullName: "Bartu OZEL",
    address: "Folkart Vega",
    city: "Izmir",
    state: "Konak",
    zipCode: "35170",
    createdAt: new Date("2024-07-24T01:53:11.175Z"),
    updatedAt: new Date("2024-07-24T01:53:11.175Z"),
  },
  createdAt: new Date("2024-07-25T00:44:42.562Z"),
  updatedAt: new Date("2024-07-25T00:44:42.562Z"),
}

describe("OrdersService", () => {
  let service: OrdersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CartService, useValue: mockCartService },
        { provide: AddressesService, useValue: mockAddressesService },
      ],
    }).compile()

    service = module.get<OrdersService>(OrdersService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("create", () => {
    it("should create an order", async () => {
      const userId = "user1"
      const createOrderDto: CreateOrderDto = { addressId: "address1" }
      const cartItems = [
        {
          product: { id: "product1", price: 100 },
          quantity: 2,
        },
      ]

      mockAddressesService.findOneById.mockResolvedValue(true)
      mockCartService.getCart.mockResolvedValue(cartItems)
      mockPrismaService.$transaction.mockResolvedValue([exampleOrderResponse])

      const result = await service.create(userId, createOrderDto)
      expect(result).toEqual(exampleOrderResponse)
      expect(mockAddressesService.findOneById).toHaveBeenCalledWith(
        userId,
        createOrderDto.addressId
      )
      expect(mockCartService.getCart).toHaveBeenCalledWith(userId)
    })

    it("should throw NotFoundException if address is not found", async () => {
      const userId = "user1"
      const createOrderDto: CreateOrderDto = { addressId: "address1" }

      mockAddressesService.findOneById.mockRejectedValue(
        new NotFoundException("Address not found")
      )

      await expect(service.create(userId, createOrderDto)).rejects.toThrow(
        NotFoundException
      )
      expect(mockAddressesService.findOneById).toHaveBeenCalledWith(
        userId,
        createOrderDto.addressId
      )
    })

    it("should throw error if cart is empty", async () => {
      const userId = "user1"
      const createOrderDto: CreateOrderDto = { addressId: "address1" }

      mockAddressesService.findOneById.mockResolvedValue(true)
      mockCartService.getCart.mockResolvedValue([])

      await expect(service.create(userId, createOrderDto)).rejects.toThrow(
        "Cart is empty"
      )
      expect(mockCartService.getCart).toHaveBeenCalledWith(userId)
    })
  })

  describe("findAll", () => {
    it("should return an array of orders", async () => {
      const userId = "user1"
      const orders = [exampleOrderResponse]

      mockPrismaService.order.findMany.mockResolvedValue(orders)

      const result = await service.findAll(userId)
      expect(result).toEqual(orders)
      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith({
        where: { userId, deletedAt: null },
        select: expect.any(Object),
        orderBy: { createdAt: "desc" },
      })
    })
  })

  describe("findOneById", () => {
    it("should return an order", async () => {
      const userId = "user1"
      const orderId = "order1"
      const order = exampleOrderResponse

      mockPrismaService.order.findUnique.mockResolvedValue(order)

      const result = await service.findOneById(userId, orderId)
      expect(result).toEqual(order)
      expect(mockPrismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: orderId, userId, deletedAt: null },
        select: expect.any(Object),
      })
    })

    it("should throw NotFoundException if order is not found", async () => {
      const userId = "user1"
      const orderId = "order1"

      mockPrismaService.order.findUnique.mockResolvedValue(null)

      await expect(service.findOneById(userId, orderId)).rejects.toThrow(
        NotFoundException
      )
    })
  })
})
