import { NotFoundException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"

import { PrismaService } from "src/prisma/prisma.service"

import { AddressesService } from "./addresses.service"
import { CreateAddressDto } from "./dto/create-address.dto"
import { UpdateAddressDto } from "./dto/update-address.dto"
import { AddressEntity } from "./entities/address.entity"

const mockPrismaService = {
  address: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}

const mockAddress: AddressEntity = {
  id: "1",
  fullName: "John Doe",
  address: "123 Main St",
  city: "Somewhere",
  state: "CA",
  zipCode: "12345",
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe("AddressesService", () => {
  let service: AddressesService
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<AddressesService>(AddressesService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("create", () => {
    it("should create an address", async () => {
      const createAddressDto: CreateAddressDto = {
        fullName: "John Doe",
        address: "123 Main St",
        city: "Somewhere",
        state: "CA",
        zipCode: "12345",
      }

      const result: AddressEntity = {
        ...mockAddress,
        ...createAddressDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaService.address.create.mockResolvedValue(result)

      expect(await service.create("user1", createAddressDto)).toEqual(result)
      expect(prisma.address.create).toHaveBeenCalledWith({
        data: { ...createAddressDto, userId: "user1" },
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
    })
  })

  describe("findAll", () => {
    it("should return an array of addresses", async () => {
      const result: AddressEntity[] = [mockAddress]

      mockPrismaService.address.findMany.mockResolvedValue(result)

      expect(await service.findAll("user1")).toEqual(result)
      expect(prisma.address.findMany).toHaveBeenCalledWith({
        where: { userId: "user1", deletedAt: null },
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
    })
  })

  describe("findOneById", () => {
    it("should return a single address", async () => {
      const result: AddressEntity = mockAddress

      mockPrismaService.address.findUnique.mockResolvedValue(result)

      expect(await service.findOneById("user1", "1")).toEqual(result)
      expect(prisma.address.findUnique).toHaveBeenCalledWith({
        where: { id: "1", userId: "user1", deletedAt: null },
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
    })

    it("should throw NotFoundException if address is not found", async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(null)

      await expect(service.findOneById("user1", "1")).rejects.toThrow(
        NotFoundException
      )
    })

    it("should throw NotFoundException if user doesnt have access to address", async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(null)

      await expect(service.findOneById("user2", "1")).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe("update", () => {
    it("should update an address", async () => {
      const updateAddressDto: UpdateAddressDto = {
        fullName: "John Doe",
        address: "456 Another St",
        city: "Anywhere",
        state: "CA",
        zipCode: "67890",
      }

      const result: AddressEntity = {
        ...mockAddress,
        ...updateAddressDto,
        updatedAt: new Date(),
      }

      mockPrismaService.address.findUnique.mockResolvedValue(mockAddress)
      mockPrismaService.address.update.mockResolvedValue(result)

      expect(await service.update("user1", "1", updateAddressDto)).toEqual(
        result
      )
      expect(prisma.address.update).toHaveBeenCalledWith({
        where: { id: "1", userId: "user1", deletedAt: null },
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
    })

    it("should throw NotFoundException if address is not found", async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(null)

      await expect(
        service.update("user1", "1", { fullName: "John Doe" })
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe("remove", () => {
    it("should soft delete an address", async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(mockAddress)
      mockPrismaService.address.update.mockResolvedValue(mockAddress)

      const result = await service.remove("user1", "1")
      expect(result).toEqual(mockAddress)
      expect(prisma.address.update).toHaveBeenCalledWith({
        where: { id: "1", userId: "user1" },
        data: { deletedAt: expect.any(Date) },
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
    })

    it("should throw NotFoundException if address is not found", async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(null)

      await expect(service.remove("user1", "1")).rejects.toThrow(
        NotFoundException
      )
    })
  })
})
