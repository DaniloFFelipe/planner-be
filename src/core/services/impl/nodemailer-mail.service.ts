import { Service } from 'typedi'

import { getMailClient } from '@/common/mail'

import { MailService } from '../mail.service'

 
export class NodeMailerMailService implements MailService {
  async sendMail(to: string, content: string): Promise<void> {
    const client = await getMailClient()
    await client.sendMail({
      to,
      text: content,
    })
  }
}
