import { Service } from 'typedi'

import { EntityRepository } from '@/common/core/domain/entity.repository'

import { User } from '../entities/user.entity'

 
export abstract class UsersRepository extends EntityRepository<User> {
  abstract findByEmail(email: string): Promise<User | null>
}
