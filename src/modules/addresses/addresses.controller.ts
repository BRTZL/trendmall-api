import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger"

import { User } from "@decorators/user"

import { AddressesService } from "./addresses.service"
import { CreateAddressDto } from "./dto/create-address.dto"
import { UpdateAddressDto } from "./dto/update-address.dto"
import { AddressEntity } from "./entities/address.entity"

@Controller("addresses")
@ApiTags("Addresses")
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOkResponse({ type: AddressEntity })
  @ApiBody({ type: CreateAddressDto })
  create(
    @User("id") userId: string,
    @Body() createAddressDto: CreateAddressDto
  ) {
    return this.addressesService.create(userId, createAddressDto)
  }

  @Get()
  @ApiOkResponse({ type: AddressEntity, isArray: true })
  findAll(@User("id") userId: string) {
    return this.addressesService.findAll(userId)
  }

  @Get(":id")
  @ApiOkResponse({ type: AddressEntity })
  findOne(@User("id") userId: string, @Param("id") id: string) {
    return this.addressesService.findOneById(userId, id)
  }

  @Patch(":id")
  @ApiOkResponse({ type: AddressEntity })
  @ApiBody({ type: UpdateAddressDto })
  update(
    @User("id") userId: string,
    @Param("id") id: string,
    @Body() updateAddressDto: UpdateAddressDto
  ) {
    return this.addressesService.update(userId, id, updateAddressDto)
  }

  @Delete(":id")
  @ApiOkResponse({ type: AddressEntity })
  remove(@User("id") userId: string, @Param("id") id: string) {
    return this.addressesService.remove(userId, id)
  }
}
