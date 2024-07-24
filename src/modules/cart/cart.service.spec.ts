import { NotFoundException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"

import { PrismaService } from "src/prisma/prisma.service"

import { CartService } from "./cart.service"
import { AddItemToCartDto } from "./dto/add-item-to-cart.dto"
import { RemoveItemFromCartDto } from "./dto/remove-item-from-cart.dto"
import { CartItemEntity } from "./entities/cart.entity"

const mockPrismaService = {
  cartItem: {
    upsert: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
}

const mockCartItem: CartItemEntity = {
  id: "1",
  product: {
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  quantity: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe("CartService", () => {
  let service: CartService
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<CartService>(CartService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("addItemToCart", () => {
    it("should add an item to an empty cart", async () => {
      const addItemToCartDto: AddItemToCartDto = {
        productId: "1",
        quantity: 2,
      }

      const result = [mockCartItem]

      mockPrismaService.cartItem.upsert.mockResolvedValue(mockCartItem)
      mockPrismaService.cartItem.findMany.mockResolvedValue(result)

      expect(await service.addItemToCart("user1", addItemToCartDto)).toEqual(
        result
      )
      expect(prisma.cartItem.upsert).toHaveBeenCalledWith({
        where: {
          userId_productId: {
            userId: "user1",
            productId: addItemToCartDto.productId,
          },
        },
        update: {
          quantity: {
            increment: addItemToCartDto.quantity,
          },
        },
        create: {
          user: {
            connect: {
              id: "user1",
            },
          },
          product: {
            connect: {
              id: addItemToCartDto.productId,
            },
          },
          quantity: addItemToCartDto.quantity,
        },
      })
    })

    it("should add additional items to the cart", async () => {
      const addItemToCartDto: AddItemToCartDto = {
        productId: "1",
        quantity: 3,
      }

      const updatedCartItem: CartItemEntity = {
        ...mockCartItem,
        quantity: mockCartItem.quantity + addItemToCartDto.quantity,
      }

      const result = [updatedCartItem]

      mockPrismaService.cartItem.upsert.mockResolvedValue(updatedCartItem)
      mockPrismaService.cartItem.findMany.mockResolvedValue(result)

      expect(await service.addItemToCart("user1", addItemToCartDto)).toEqual(
        result
      )
      expect(prisma.cartItem.upsert).toHaveBeenCalledWith({
        where: {
          userId_productId: {
            userId: "user1",
            productId: addItemToCartDto.productId,
          },
        },
        update: {
          quantity: {
            increment: addItemToCartDto.quantity,
          },
        },
        create: {
          user: {
            connect: {
              id: "user1",
            },
          },
          product: {
            connect: {
              id: addItemToCartDto.productId,
            },
          },
          quantity: addItemToCartDto.quantity,
        },
      })
    })
  })

  describe("removeItemFromCart", () => {
    it("should remove an item from the cart", async () => {
      const removeItemFromCartDto: RemoveItemFromCartDto = {
        productId: "1",
        quantity: 1,
      }

      const updatedCartItem: CartItemEntity = {
        ...mockCartItem,
        quantity: mockCartItem.quantity - removeItemFromCartDto.quantity,
      }

      const result = [updatedCartItem]

      mockPrismaService.cartItem.findUnique.mockResolvedValue(mockCartItem)
      mockPrismaService.cartItem.update.mockResolvedValue(updatedCartItem)
      mockPrismaService.cartItem.findMany.mockResolvedValue(result)

      expect(
        await service.removeItemFromCart("user1", removeItemFromCartDto)
      ).toEqual(result)
      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: {
          userId_productId: {
            userId: "user1",
            productId: removeItemFromCartDto.productId,
          },
        },
        data: {
          quantity: {
            decrement: removeItemFromCartDto.quantity,
          },
        },
      })
    })

    it("should delete the cart item if the quantity becomes zero", async () => {
      const removeItemFromCartDto: RemoveItemFromCartDto = {
        productId: "1",
        quantity: 2,
      }

      mockPrismaService.cartItem.findUnique.mockResolvedValue(mockCartItem)
      mockPrismaService.cartItem.delete.mockResolvedValue(mockCartItem)
      mockPrismaService.cartItem.findMany.mockResolvedValue([])

      expect(
        await service.removeItemFromCart("user1", removeItemFromCartDto)
      ).toEqual([])
      expect(prisma.cartItem.delete).toHaveBeenCalledWith({
        where: {
          id: mockCartItem.id,
        },
      })
    })

    it("should throw NotFoundException if cart item is not found", async () => {
      const removeItemFromCartDto: RemoveItemFromCartDto = {
        productId: "1",
        quantity: 1,
      }

      mockPrismaService.cartItem.findUnique.mockResolvedValue(null)

      await expect(
        service.removeItemFromCart("user1", removeItemFromCartDto)
      ).rejects.toThrow(NotFoundException)
    })

    it("should throw NotFoundException if trying to remove more items than present", async () => {
      const removeItemFromCartDto: RemoveItemFromCartDto = {
        productId: "1",
        quantity: 5,
      }

      const insufficientQuantityCartItem: CartItemEntity = {
        ...mockCartItem,
        quantity: 3,
      }

      mockPrismaService.cartItem.findUnique.mockResolvedValue(
        insufficientQuantityCartItem
      )

      await expect(
        service.removeItemFromCart("user1", removeItemFromCartDto)
      ).rejects.toThrow("Not enough items in cart")
    })
  })

  describe("getCart", () => {
    it("should return the cart items", async () => {
      const result: CartItemEntity[] = [mockCartItem]

      mockPrismaService.cartItem.findMany.mockResolvedValue(result)

      expect(await service.getCart("user1")).toEqual(result)
      expect(prisma.cartItem.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user1",
        },
        select: {
          id: true,
          product: {
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
              createdAt: true,
              updatedAt: true,
            },
          },
          quantity: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    })

    it("should return an empty array if the cart is empty", async () => {
      const result: CartItemEntity[] = []

      mockPrismaService.cartItem.findMany.mockResolvedValue(result)

      expect(await service.getCart("user1")).toEqual(result)
      expect(prisma.cartItem.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user1",
        },
        select: {
          id: true,
          product: {
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
              createdAt: true,
              updatedAt: true,
            },
          },
          quantity: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    })
  })
})
