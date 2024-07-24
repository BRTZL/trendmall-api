import { Test, TestingModule } from "@nestjs/testing"

import { PrismaService } from "./prisma.service"

describe("PrismaService", () => {
  let service: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile()

    service = module.get<PrismaService>(PrismaService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("onModuleInit", () => {
    it("should call $connect method", async () => {
      // Mock the $connect method
      service.$connect = jest.fn()

      await service.onModuleInit()

      expect(service.$connect).toHaveBeenCalled()
    })

    it("should handle connection errors", async () => {
      // Mock the $connect method to throw an error
      service.$connect = jest
        .fn()
        .mockRejectedValue(new Error("Connection failed"))

      await expect(service.onModuleInit()).rejects.toThrow("Connection failed")
    })
  })
})
