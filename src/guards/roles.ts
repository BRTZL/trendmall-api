import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"

import { UserRole } from "@prisma/client"

import { UsersService } from "@modules/users/users.service"

import { IS_PUBLIC_KEY } from "@decorators/public"
import { ROLES_KEY } from "@decorators/roles"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    )

    const request = context.switchToHttp().getRequest()
    const userId = request.user.id

    if (!requiredRoles) {
      return true
    }

    const user = await this.usersService.findRoleById(userId)

    if (!user) {
      throw new ForbiddenException("User not found")
    }

    if (requiredRoles.includes(user.role)) {
      return true
    }

    throw new ForbiddenException("User not authorized")
  }
}
