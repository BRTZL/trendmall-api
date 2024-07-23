import { Global, Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"

import { PrismaService } from "./prisma.service"

@Global()
@Module({
  imports: [JwtModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
