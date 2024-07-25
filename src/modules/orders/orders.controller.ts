import { Body, Controller, Get, Param, Post } from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger"

import { User } from "@decorators/user"

import { CreateOrderDto } from "./dto/create-order.dto"
import { OrderEntity } from "./entities/order.entity"
import { OrdersService } from "./orders.service"

@Controller("orders")
@ApiTags("Orders")
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOkResponse({ type: OrderEntity })
  @ApiBody({ type: CreateOrderDto })
  checkout(@User("id") userId: string, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(userId, createOrderDto)
  }

  @Get()
  @ApiOkResponse({ type: OrderEntity, isArray: true })
  findAll(@User("id") userId: string) {
    return this.ordersService.findAll(userId)
  }

  @Get(":id")
  @ApiOkResponse({ type: OrderEntity })
  findOne(@User("id") userId: string, @Param("id") id: string) {
    return this.ordersService.findOneById(userId, id)
  }
}
