import { z } from 'zod'

export const RequestAuthCodeDtoSchema = z.object({
  email: z.string().email(),
})

export type RequestAuthCodeDto = z.infer<typeof RequestAuthCodeDtoSchema>
