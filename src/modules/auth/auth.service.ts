import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

import * as bcrypt from "bcryptjs"

import { UsersService } from "@modules/users/users.service"

import { LoginDto } from "./dto/login.dto"
import { RegisterDto } from "./dto/register.dto"
import { AuthEntity } from "./entities/auth.entity"

@Injectable()
export class AuthService {
  saltOrRounds = 10

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: LoginDto): Promise<AuthEntity> {
    const user = await this.usersService.findOneByEmailWithPassword(dto.email)

    if (!user) {
      throw new NotFoundException("User not found with this email")
    }
    const isMatch = await bcrypt.compare(dto.password, user.password)
    if (!isMatch) {
      throw new UnauthorizedException("Invalid password")
    }

    const payload = { sub: user.id, email: user.email }
    const accessToken = await this.jwtService.signAsync(payload)

    return {
      accessToken,
      expiresIn: 60 * 60 * 24 * 30, // 30 days
    }
  }

  async register(dto: RegisterDto): Promise<AuthEntity> {
    const existingUser = await this.usersService.findOneByEmail(dto.email)
    if (existingUser) {
      throw new BadRequestException("User already exists with this email")
    }

    const hashPass = await bcrypt.hash(dto.password, this.saltOrRounds)

    const user = await this.usersService.create({
      email: dto.email,
      password: hashPass,
    })

    const payload = { sub: user.id, email: user.email }
    const accessToken = await this.jwtService.signAsync(payload)

    return {
      accessToken,
      expiresIn: 60 * 60 * 24 * 30, // 30 days
    }
  }
}
