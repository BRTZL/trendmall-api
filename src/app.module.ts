import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ScheduleModule } from "@nestjs/schedule"

import { AuthModule } from "./modules/auth/auth.module"
import { CategoriesModule } from "./modules/categories/categories.module"
import { CronModule } from "./modules/cron/cron.module"
import { EmailModule } from "./modules/email/email.module"
import { UsersModule } from "./modules/users/users.module"
import { PrismaModule } from "./prisma/prisma.module"

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    EmailModule,
    CronModule,
    CategoriesModule,
  ],
})
export class AppModule {}
