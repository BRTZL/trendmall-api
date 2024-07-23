import { Injectable } from "@nestjs/common"

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

  findOneById(id: string): Promise<UserEntity> {
    return this.prisma.user.findUnique({
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
  }

  findOneByEmail(email: string): Promise<UserEntity> {
    return this.prisma.user.findUnique({
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
  }

  findRoleById(id: string): Promise<Pick<User, "role">> {
    return this.prisma.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        role: true,
      },
    })
  }

  findOneByEmailWithPassword(
    email: string
  ): Promise<Pick<User, "id" | "email" | "password">> {
    return this.prisma.user.findUnique({
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
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
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

  remove(id: string): Promise<UserEntity> {
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
