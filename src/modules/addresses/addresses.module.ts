import { Module } from "@nestjs/common"

import { AddressesController } from "./addresses.controller"
import { AddressesService } from "./addresses.service"

@Module({
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
