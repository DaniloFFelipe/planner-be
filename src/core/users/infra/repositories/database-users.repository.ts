import { PrismaClient } from '@prisma/client'
import { Service } from 'typedi'

import { prisma } from '@/common/prisma/prisma'

import { User } from '../../domain/entities/user.entity'
import { UsersRepository } from '../../domain/repositories/user.repository'
import { UserPrismaMapper } from '../mappers/user-prisma.mapper'

 
export class DatabaseUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    if (!user) return null
    return UserPrismaMapper.toDomain(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    if (!user) return null
    return UserPrismaMapper.toDomain(user)
  }

  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: UserPrismaMapper.toPrisma(user),
    })
  }

  async save(user: User): Promise<void> {
    await prisma.user.update({
      where: { id: user.id },
      data: UserPrismaMapper.toPrisma(user),
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    })
  }
}
