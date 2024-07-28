import { Body, Controller, Post, Res } from "@nestjs/common"
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger"

import { Response } from "express"

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
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const res = await this.authService.login(loginDto)

    response.cookie("accessToken", res.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    })

    return res
  }

  @Post("register")
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ type: AuthEntity })
  @Public()
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const res = await this.authService.register(registerDto)

    response.cookie("accessToken", res.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    })

    return res
  }
}
