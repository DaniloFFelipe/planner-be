import { prisma } from '@/common/prisma/prisma'

import { AuthToken } from '../../domain/entities/auth-token.entity'
import { AuthTokensRepository } from '../../domain/repositories/auth-token.repository'
import { AuthTokenPrismaMapper } from '../mappers/auth-token-prisma.mapper'

export class DatabaseAuthTokensRepository implements AuthTokensRepository {
  async findByUserId(userId: string): Promise<AuthToken | null> {
    const authToken = await prisma.authToken.findUnique({
      where: { user_id: userId },
    })
    if (!authToken) return null
    return AuthTokenPrismaMapper.toDomain(authToken)
  }

  async findById(id: string): Promise<AuthToken | null> {
    const authToken = await prisma.authToken.findUnique({
      where: { id },
    })
    if (!authToken) return null
    return AuthTokenPrismaMapper.toDomain(authToken)
  }

  async create(authToken: AuthToken): Promise<void> {
    await prisma.authToken.create({
      data: AuthTokenPrismaMapper.toPrisma(authToken),
    })
  }

  async save(authToken: AuthToken): Promise<void> {
    await prisma.authToken.update({
      where: { id: authToken.id },
      data: AuthTokenPrismaMapper.toPrisma(authToken),
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.authToken.delete({
      where: { id },
    })
  }
}
