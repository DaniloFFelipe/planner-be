import { Prisma, User as RawUser } from '@prisma/client'

import { User } from '../../domain/entities/user.entity'

export class UserPrismaMapper {
  static toDomain(raw: RawUser): User {
    return User.create({ email: raw.email, name: raw.name }, raw.id)
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return user.toJSON()
  }
}
