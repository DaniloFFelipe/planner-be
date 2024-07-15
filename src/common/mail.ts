import nodemailer from 'nodemailer'

import { env } from './env'

export async function getMailClient() {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: undefined,
  })

  return transporter
}
