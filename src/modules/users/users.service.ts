import { Injectable, NotFoundException } from "@nestjs/common"

import { Prisma, User } from "@prisma/client"

import { PrismaService } from "src/prisma/prisma.service"

import { UpdateUserDto } from "./dto/update-user.dto"
import { UserEntity } from "./entities/user.entity"

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: Prisma.UserCreateInput): Promise<UserEntity> {
    return this.prisma.user.create({
      data: createUserDto,
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return user
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        deletedAt: null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return user
  }

  async findRoleById(id: string): Promise<Pick<User, "role">> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        role: true,
      },
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return user
  }

  async findOneByEmailWithPassword(
    email: string
  ): Promise<Pick<User, "id" | "email" | "password">> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    await this.findOneById(id)

    return this.prisma.user.update({
      where: {
        id,
        deletedAt: null,
      },
      data: updateUserDto,
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async remove(id: string): Promise<UserEntity> {
    await this.findOneById(id)

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }
}
