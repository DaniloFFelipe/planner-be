import { z } from 'zod'

export const envSchema = z.object({
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  APPLICATION_DOMAIN_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
})
