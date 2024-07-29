import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import { ScheduleModule } from "@nestjs/schedule"
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"

import { AddressesModule } from "./modules/addresses/addresses.module"
import { AuthModule } from "./modules/auth/auth.module"
import { CartModule } from "./modules/cart/cart.module"
import { CategoriesModule } from "./modules/categories/categories.module"
import { CronModule } from "./modules/cron/cron.module"
import { OrdersModule } from "./modules/orders/orders.module"
import { ProductsModule } from "./modules/products/products.module"
import { UsersModule } from "./modules/users/users.module"
import { PrismaModule } from "./prisma/prisma.module"

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: "medium",
        ttl: 10000,
        limit: 20,
      },
      {
        name: "long",
        ttl: 60000,
        limit: 100,
      },
    ]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CronModule,
    CategoriesModule,
    ProductsModule,
    AddressesModule,
    CartModule,
    OrdersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
