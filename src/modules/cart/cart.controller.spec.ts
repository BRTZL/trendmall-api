import { Test, TestingModule } from "@nestjs/testing"

import { CartController } from "./cart.controller"
import { CartService } from "./cart.service"
import { AddItemToCartDto } from "./dto/add-item-to-cart.dto"
import { RemoveItemFromCartDto } from "./dto/remove-item-from-cart.dto"
import { CartItemEntity } from "./entities/cart.entity"

const mockCartService = {
  addItemToCart: jest.fn(),
  removeItemFromCart: jest.fn(),
  getCart: jest.fn(),
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
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  quantity: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe("CartController", () => {
  let controller: CartController
  let service: CartService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [{ provide: CartService, useValue: mockCartService }],
    }).compile()

    controller = module.get<CartController>(CartController)
    service = module.get<CartService>(CartService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("addItemToCart", () => {
    it("should add an item to the cart", async () => {
      const addItemToCartDto: AddItemToCartDto = {
        productId: "1",
        quantity: 2,
      }

      const result: CartItemEntity[] = [mockCartItem]

      mockCartService.addItemToCart.mockResolvedValue(result)

      expect(await controller.addItemToCart("user1", addItemToCartDto)).toEqual(
        result
      )
      expect(service.addItemToCart).toHaveBeenCalledWith(
        "user1",
        addItemToCartDto
      )
    })
  })

  describe("removeItemFromCart", () => {
    it("should remove an item from the cart", async () => {
      const removeItemFromCartDto: RemoveItemFromCartDto = {
        productId: "1",
        quantity: 1,
      }

      const result: CartItemEntity[] = [mockCartItem]

      mockCartService.removeItemFromCart.mockResolvedValue(result)

      expect(
        await controller.removeItemFromCart("user1", removeItemFromCartDto)
      ).toEqual(result)
      expect(service.removeItemFromCart).toHaveBeenCalledWith(
        "user1",
        removeItemFromCartDto
      )
    })
  })

  describe("getCart", () => {
    it("should return the cart items", async () => {
      const result: CartItemEntity[] = [mockCartItem]

      mockCartService.getCart.mockResolvedValue(result)

      expect(await controller.getCart("user1")).toEqual(result)
      expect(service.getCart).toHaveBeenCalledWith("user1")
    })
  })
})
