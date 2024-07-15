import { z } from 'zod'

export const AuthenticateDtoSchema = z.object({
  code: z.string().length(6),
  token: z.string().uuid(),
})

export type AuthenticateDto = z.infer<typeof AuthenticateDtoSchema>
