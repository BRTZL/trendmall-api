import { Injectable, NotFoundException } from "@nestjs/common"

import { PrismaService } from "src/prisma/prisma.service"

import { AddItemToCartDto } from "./dto/add-item-to-cart.dto"
import { RemoveItemFromCartDto } from "./dto/remove-item-from-cart.dto"
import { CartItemEntity } from "./entities/cart.entity"

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addItemToCart(userId: string, addItemToCartDto: AddItemToCartDto) {
    await this.prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
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
            id: userId,
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

    return this.getCart(userId)
  }

  async removeItemFromCart(
    userId: string,
    removeItemFromCartDto: RemoveItemFromCartDto
  ) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: removeItemFromCartDto.productId,
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    })

    if (!cartItem) {
      throw new NotFoundException("Cart item not found")
    }

    if (cartItem.quantity < removeItemFromCartDto.quantity) {
      throw new NotFoundException("Not enough items in cart")
    } else if (cartItem.quantity === removeItemFromCartDto.quantity) {
      await this.prisma.cartItem.delete({
        where: {
          id: cartItem.id,
        },
      })

      return this.getCart(userId)
    }

    await this.prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId: removeItemFromCartDto.productId,
        },
      },
      data: {
        quantity: {
          decrement: removeItemFromCartDto.quantity,
        },
      },
    })

    return this.getCart(userId)
  }

  getCart(userId: string): Promise<CartItemEntity[]> {
    return this.prisma.cartItem.findMany({
      where: {
        userId,
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
  }
}
