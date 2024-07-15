import { NodeMailerMailService } from '@/core/services/impl/nodemailer-mail.service'
import { UsersService } from '@/core/users/domain/services/user.service'
import { DatabaseUsersRepository } from '@/core/users/infra/repositories/database-users.repository'

import { AuthTokenFactory } from './authtoken-factory'

export const UsersFactory = {
  makeService() {
    return new UsersService(
      new DatabaseUsersRepository(),
      AuthTokenFactory.makeService(),
      new NodeMailerMailService(),
    )
  },
}
