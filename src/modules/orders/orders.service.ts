import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"

import { PrismaService } from "src/prisma/prisma.service"

import { AddressesService } from "@modules/addresses/addresses.service"
import { CartService } from "@modules/cart/cart.service"

import { CreateOrderDto } from "./dto/create-order.dto"
import { OrderEntity } from "./entities/order.entity"

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly addressService: AddressesService
  ) {}

  async create(
    userId: string,
    createOrderDto: CreateOrderDto
  ): Promise<OrderEntity> {
    // Validate address
    await this.addressService.findOneById(userId, createOrderDto.addressId)

    // Get cart items
    const cartItems = await this.cartService.getCart(userId)

    if (cartItems.length === 0) {
      throw new BadRequestException("Cart is empty")
    }

    // Calculate total
    const total = cartItems.reduce((acc, cartItem) => {
      return acc + cartItem.product.price * cartItem.quantity
    }, 0)

    // Create order
    const [order] = await this.prisma.$transaction([
      this.prisma.order.create({
        data: {
          total,
          status: "PENDING",
          address: {
            connect: {
              id: createOrderDto.addressId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
          items: {
            createMany: {
              data: cartItems.map((cartItem) => ({
                productId: cartItem.product.id,
                quantity: cartItem.quantity,
                price: cartItem.product.price,
              })),
            },
          },
        },
        select: orderSelect,
      }),
      this.prisma.cartItem.deleteMany({
        where: {
          userId,
        },
      }),
    ])

    return order
  }

  findAll(userId: string): Promise<OrderEntity[]> {
    return this.prisma.order.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: orderSelect,
    })
  }

  async findOneById(userId: string, id: string): Promise<OrderEntity> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      select: orderSelect,
    })

    if (!order) {
      throw new NotFoundException("Order not found")
    }

    return order
  }
}

const orderSelect = {
  id: true,
  total: true,
  status: true,
  items: {
    select: {
      id: true,
      quantity: true,
      price: true,
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
      createdAt: true,
      updatedAt: true,
    },
  },
  address: {
    select: {
      id: true,
      fullName: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} as const
