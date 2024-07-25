import { Body, Controller, Get, Post } from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger"

import { User } from "@decorators/user"

import { CartService } from "./cart.service"
import { AddItemToCartDto } from "./dto/add-item-to-cart.dto"
import { RemoveItemFromCartDto } from "./dto/remove-item-from-cart.dto"
import { CartItemEntity } from "./entities/cart.entity"

@Controller("cart")
@ApiTags("Cart")
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post("/add")
  @ApiOkResponse({ type: CartItemEntity, isArray: true })
  @ApiBody({ type: AddItemToCartDto })
  addItemToCart(
    @User("id") userId: string,
    @Body() addItemToCartDto: AddItemToCartDto
  ) {
    return this.cartService.addItemToCart(userId, addItemToCartDto)
  }

  @Post("/remove")
  @ApiOkResponse({ type: CartItemEntity, isArray: true })
  @ApiBody({ type: RemoveItemFromCartDto })
  removeItemFromCart(
    @User("id") userId: string,
    @Body() removeItemFromCartDto: RemoveItemFromCartDto
  ) {
    return this.cartService.removeItemFromCart(userId, removeItemFromCartDto)
  }

  @Get()
  @ApiOkResponse({ type: CartItemEntity, isArray: true })
  getCart(@User("id") userId: string) {
    return this.cartService.getCart(userId)
  }
}
