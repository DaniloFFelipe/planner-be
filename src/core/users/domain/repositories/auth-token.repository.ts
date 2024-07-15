import { Service } from 'typedi'

import { EntityRepository } from '@/common/core/domain/entity.repository'

import { AuthToken } from '../entities/auth-token.entity'

 
export abstract class AuthTokensRepository extends EntityRepository<AuthToken> {
  abstract findByUserId(id: string): Promise<AuthToken | null>
}
