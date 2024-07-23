import { Body, Controller, Delete, Get, Patch } from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger"

import { IdParam } from "@decorators/id-param"
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
  me(@User("id") userId: string) {
    return this.usersService.findOneById(userId)
  }

  @Get(":id")
  @ApiOkResponse({ type: UserEntity })
  findOne(@IdParam("id") id: string) {
    return this.usersService.findOneById(id)
  }

  @Patch(":id")
  @ApiOkResponse({ type: UserEntity })
  @ApiBody({ type: UpdateUserDto })
  update(@IdParam("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @Delete(":id")
  @ApiOkResponse({ type: UserEntity })
  remove(@IdParam("id") id: string) {
    return this.usersService.remove(id)
  }
}
