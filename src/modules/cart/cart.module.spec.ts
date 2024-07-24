import { Test, TestingModule } from "@nestjs/testing"

import { PrismaModule } from "src/prisma/prisma.module"

import { CartController } from "./cart.controller"
import { CartModule } from "./cart.module"
import { CartService } from "./cart.service"

describe("CartModule", () => {
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CartModule, PrismaModule],
    }).compile()
  })

  it("should be defined", () => {
    expect(module).toBeDefined()
  })

  it("should provide CartController", () => {
    const controller = module.get<CartController>(CartController)
    expect(controller).toBeDefined()
  })

  it("should provide CartService", () => {
    const service = module.get<CartService>(CartService)
    expect(service).toBeDefined()
  })
})
