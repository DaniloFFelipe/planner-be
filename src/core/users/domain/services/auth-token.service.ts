import { CodeGeneratorService } from '../../../services/code-generator.service'
import { AuthenticateDto } from '../dtos/authenticate.dto'
import { AuthToken } from '../entities/auth-token.entity'
import { AuthTokensRepository } from '../repositories/auth-token.repository'

export class AuthTokenService {
  constructor(
    private authTokenRepository: AuthTokensRepository,
    private codeService: CodeGeneratorService,
  ) {}

  async create(userId: string) {
    let authToken = await this.authTokenRepository.findByUserId(userId)
    if (authToken) {
      await this.authTokenRepository.delete(authToken.id)
    }

    authToken = AuthToken.create({
      code: this.codeService.generate(),
      userId,
    })
    await this.authTokenRepository.create(authToken)
    return authToken
  }

  async validate({ code, token }: AuthenticateDto) {
    const authToken = await this.authTokenRepository.findById(token)
    if (!authToken) return null
    if (authToken.code.toUpperCase() !== code.toUpperCase()) return null
    await this.authTokenRepository.delete(authToken.id)

    return authToken
  }
}
