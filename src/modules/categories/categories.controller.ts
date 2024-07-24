import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger"

import { Public } from "@decorators/public"
import { Roles } from "@decorators/roles"

import { CategoriesService } from "./categories.service"
import { CreateCategoryDto } from "./dto/create-category.dto"
import { UpdateCategoryDto } from "./dto/update-category.dto"
import { CategoryEntity } from "./entities/category.entity"

@Controller("categories")
@ApiTags("Categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles("ADMIN")
  @ApiOkResponse({ type: CategoryEntity })
  @ApiBody({ type: CreateCategoryDto })
  @ApiBearerAuth()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto)
  }

  @Get()
  @ApiOkResponse({ type: CategoryEntity, isArray: true })
  @Public()
  findAll() {
    return this.categoriesService.findAll()
  }

  @Get(":id")
  @ApiOkResponse({ type: CategoryEntity })
  @Public()
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.categoriesService.findOneById(id)
  }

  @Patch(":id")
  @Roles("ADMIN")
  @ApiOkResponse({ type: CategoryEntity })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiBearerAuth()
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(id, updateCategoryDto)
  }

  @Delete(":id")
  @Roles("ADMIN")
  @ApiOkResponse({ type: CategoryEntity })
  @ApiBearerAuth()
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id)
  }
}
