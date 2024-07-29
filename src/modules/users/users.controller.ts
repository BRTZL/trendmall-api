import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger"

import { Roles } from "@decorators/roles"
import { User } from "@decorators/user"

import { UpdateUserDto } from "./dto/update-user.dto"
import { UserEntity } from "./entities/user.entity"
import { UsersService } from "./users.service"

@Controller("users")
@ApiTags("Users")
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiOkResponse({ type: UserEntity })
  getMe(@User("id") userId: string) {
    return this.usersService.findOneById(userId)
  }

  @Patch("me")
  @ApiOkResponse({ type: UserEntity })
  @ApiBody({ type: UpdateUserDto })
  updateMe(@User("id") userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto)
  }

  @Get(":id")
  @ApiOkResponse({ type: UserEntity })
  @Roles("ADMIN")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.findOneById(id)
  }

  @Patch(":id")
  @ApiOkResponse({ type: UserEntity })
  @ApiBody({ type: UpdateUserDto })
  @Roles("ADMIN")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto)
  }

  @Delete(":id")
  @ApiOkResponse({ type: UserEntity })
  @Roles("ADMIN")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.remove(id)
  }
}
