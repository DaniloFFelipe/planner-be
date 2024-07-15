import { Entity } from '@/common/core/domain/entity'

export interface AuthTokenProps {
  code: string
  userId: string
  createdAt: Date
}

export interface AuthTokenCreateProps {
  code: string
  userId: string
  createdAt?: Date
}

export class AuthToken extends Entity<AuthTokenProps> {
  toJSON(): unknown {
    return {
      id: this.id,
      code: this.props.code,
      userId: this.props.userId,
    }
  }

  get code() {
    return this.props.code
  }

  get userId() {
    return this.props.userId
  }

  static create(
    { code, userId, createdAt = new Date() }: AuthTokenCreateProps,
    id?: string,
  ) {
    return new AuthToken({ code, userId, createdAt }, id)
  }
}
