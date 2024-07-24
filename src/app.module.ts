import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ScheduleModule } from "@nestjs/schedule"

import { AddressesModule } from "./modules/addresses/addresses.module"
import { AuthModule } from "./modules/auth/auth.module"
import { CartModule } from "./modules/cart/cart.module"
import { CategoriesModule } from "./modules/categories/categories.module"
import { CronModule } from "./modules/cron/cron.module"
import { EmailModule } from "./modules/email/email.module"
import { ProductsModule } from "./modules/products/products.module"
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
    ProductsModule,
    AddressesModule,
    CartModule,
  ],
})
export class AppModule {}
