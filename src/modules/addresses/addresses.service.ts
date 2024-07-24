import { Injectable, NotFoundException } from "@nestjs/common"

import { PrismaService } from "src/prisma/prisma.service"

import { CreateAddressDto } from "./dto/create-address.dto"
import { UpdateAddressDto } from "./dto/update-address.dto"
import { AddressEntity } from "./entities/address.entity"

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    userId: string,
    createAddressDto: CreateAddressDto
  ): Promise<AddressEntity> {
    return this.prisma.address.create({
      data: {
        ...createAddressDto,
        userId,
      },
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
    })
  }

  findAll(userId: string): Promise<AddressEntity[]> {
    return this.prisma.address.findMany({
      where: {
        userId,
        deletedAt: null,
      },
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
    })
  }

  async findOneById(userId: string, id: string): Promise<AddressEntity> {
    const address = await this.prisma.address.findUnique({
      where: {
        id,
        userId,
        deletedAt: null,
      },
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
    })

    if (!address) {
      throw new NotFoundException("Address not found")
    }

    return address
  }

  async update(
    userId: string,
    id: string,
    updateAddressDto: UpdateAddressDto
  ): Promise<AddressEntity> {
    await this.findOneById(userId, id)

    return this.prisma.address.update({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      data: updateAddressDto,
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
    })
  }

  async remove(userId: string, id: string): Promise<AddressEntity> {
    await this.findOneById(userId, id)

    return this.prisma.address.update({
      where: {
        id,
        userId,
      },
      data: {
        deletedAt: new Date(),
      },
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
    })
  }
}
