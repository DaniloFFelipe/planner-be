import { NanoIdCodeGeneratorService } from '@/core/services/impl/nanoid-code-generator.service'
import { AuthTokenService } from '@/core/users/domain/services/auth-token.service'
import { DatabaseAuthTokensRepository } from '@/core/users/infra/repositories/database-auth-token.repository'

export const AuthTokenFactory = {
  makeService() {
    return new AuthTokenService(
      new DatabaseAuthTokensRepository(),
      new NanoIdCodeGeneratorService(),
    )
  },
}
