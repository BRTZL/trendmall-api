import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"

import { Request } from "express"

import { UsersService } from "@modules/users/users.service"

import { IS_PUBLIC_KEY } from "@decorators/public"

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name)
  private readonly jwtSecret: string

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector
  ) {
    this.jwtSecret = this.configService.get<string>("JWT_SECRET")
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()

    const token = this.extractToken(request)

    if (!token) {
      this.logger.warn("No token provided")
      throw new UnauthorizedException()
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      })

      const user = await this.usersService.findOneById(payload.sub)

      if (!user) {
        this.logger.warn("User not found")
        throw new UnauthorizedException()
      }

      request["user"] = user
    } catch (error) {
      this.logger.error("Unknow error", error)
      throw new UnauthorizedException()
    }
    return true
  }

  private extractToken(request: Request): string | undefined {
    // Check Authorization header
    const authHeader = request.headers.authorization
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.split(" ")[1]
    }

    // Check cookies
    const authCookie = request.cookies["accessToken"]
    if (authCookie) {
      return authCookie
    }

    return null
  }
}
