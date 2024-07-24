import { ValidationPipe, VersioningType } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

import * as cookieParser from "cookie-parser"

import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  })
  app.enableCors({
    // origin: true,
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle("Trendmall API")
    .setDescription("The Trendmall API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("/", app, document)

  await app.listen(process.env.PORT || 3001)
}
bootstrap()
