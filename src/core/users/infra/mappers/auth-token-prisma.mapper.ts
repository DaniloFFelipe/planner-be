import { AuthToken as RawAuthToken, Prisma } from '@prisma/client'

import { AuthToken } from '../../domain/entities/auth-token.entity'

export class AuthTokenPrismaMapper {
  static toDomain(raw: RawAuthToken): AuthToken {
    return AuthToken.create({ code: raw.code, userId: raw.user_id }, raw.id)
  }

  static toPrisma(authToken: AuthToken): Prisma.AuthTokenUncheckedCreateInput {
    return {
      id: authToken.id,
      code: authToken.code,
      user_id: authToken.userId,
    }
  }
}
