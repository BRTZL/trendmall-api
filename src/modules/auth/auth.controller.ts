import { Body, Controller, Post } from "@nestjs/common"
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger"

import { Public } from "@decorators/public"

import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { RegisterDto } from "./dto/register.dto"
import { AuthEntity } from "./entities/auth.entity"

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthEntity })
  @Public()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post("register")
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ type: AuthEntity })
  @Public()
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }
}
