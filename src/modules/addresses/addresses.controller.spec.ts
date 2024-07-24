import { Test, TestingModule } from "@nestjs/testing"

import { AddressesController } from "./addresses.controller"
import { AddressesService } from "./addresses.service"
import { CreateAddressDto } from "./dto/create-address.dto"
import { UpdateAddressDto } from "./dto/update-address.dto"
import { AddressEntity } from "./entities/address.entity"

describe("AddressesController", () => {
  let controller: AddressesController
  let service: AddressesService

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

  const mockAddressesService = {
    create: jest.fn().mockResolvedValue(mockAddress),
    findAll: jest.fn().mockResolvedValue([mockAddress]),
    findOneById: jest.fn().mockResolvedValue(mockAddress),
    update: jest.fn().mockResolvedValue(mockAddress),
    remove: jest.fn().mockResolvedValue(mockAddress),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressesController],
      providers: [
        {
          provide: AddressesService,
          useValue: mockAddressesService,
        },
      ],
    }).compile()

    controller = module.get<AddressesController>(AddressesController)
    service = module.get<AddressesService>(AddressesService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
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

      const result = await controller.create("user1", createAddressDto)
      expect(result).toEqual(mockAddress)
      expect(service.create).toHaveBeenCalledWith("user1", createAddressDto)
    })
  })

  describe("findAll", () => {
    it("should return an array of addresses", async () => {
      const result = await controller.findAll("user1")
      expect(result).toEqual([mockAddress])
      expect(service.findAll).toHaveBeenCalledWith("user1")
    })
  })

  describe("findOne", () => {
    it("should return a single address", async () => {
      const result = await controller.findOne("user1", "1")
      expect(result).toEqual(mockAddress)
      expect(service.findOneById).toHaveBeenCalledWith("user1", "1")
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

      const result = await controller.update("user1", "1", updateAddressDto)
      expect(result).toEqual(mockAddress)
      expect(service.update).toHaveBeenCalledWith(
        "user1",
        "1",
        updateAddressDto
      )
    })
  })

  describe("remove", () => {
    it("should remove an address", async () => {
      const result = await controller.remove("user1", "1")
      expect(result).toEqual(mockAddress)
      expect(service.remove).toHaveBeenCalledWith("user1", "1")
    })
  })
})
