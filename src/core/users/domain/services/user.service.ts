import { BadRequestError } from '@/common/core/errors/bad-request-error'

import { MailService } from '../../../services/mail.service'
import { AuthenticateDto } from '../dtos/authenticate.dto'
import { RequestAuthCodeDto } from '../dtos/request-code.dto'
import { User } from '../entities/user.entity'
import { UsersRepository } from '../repositories/user.repository'
import { AuthTokenService } from './auth-token.service'

export class UsersService {
  constructor(
    public usersRepository: UsersRepository,
    public authTokenService: AuthTokenService,
    public mailService: MailService,
  ) {}

  async requestCode({ email }: RequestAuthCodeDto) {
    let hasToUpdateName = false
    let user = await this.usersRepository.findByEmail(email)
    if (!user) {
      hasToUpdateName = true
      user = User.create({ email })
      await this.usersRepository.create(user)
    }

    const authToken = await this.authTokenService.create(user.id)
    await this.mailService.sendMail(
      user.email,
      `Your code is: ${authToken.code}`,
    )

    return {
      hasToUpdateName,
      authToken,
    }
  }

  async authenticate({ code, token }: AuthenticateDto) {
    console.log({ code, token })
    const authToken = await this.authTokenService.validate({ code, token })
    if (!authToken) throw new BadRequestError('Invalid code or token')

    const user = await this.usersRepository.findById(authToken.userId)
    if (!user) throw new BadRequestError('Invalid code or token')

    return {
      user,
    }
  }

  async findById(userId: string) {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw new BadRequestError('Invalid code or token')
    return user
  }

  async updateUserName(name: string, userId: string) {
    const user = await this.findById(userId)
    user.name = name
    await this.usersRepository.save(user)
    return { user }
  }
}
