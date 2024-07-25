import { Module } from "@nestjs/common"

import { AddressesService } from "@modules/addresses/addresses.service"
import { CartService } from "@modules/cart/cart.service"

import { OrdersController } from "./orders.controller"
import { OrdersService } from "./orders.service"

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, CartService, AddressesService],
  exports: [OrdersService],
})
export class OrdersModule {}
