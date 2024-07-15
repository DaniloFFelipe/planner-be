import { Service } from 'typedi'

 
export abstract class MailService {
  abstract sendMail(to: string, content: string): Promise<void>
}
