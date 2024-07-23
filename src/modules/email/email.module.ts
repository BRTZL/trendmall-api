import { Module } from "@nestjs/common"

import { UsersModule } from "@modules/users/users.module"

import { EmailService } from "./email.service"

@Module({
  imports: [UsersModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
