import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { RequestAuthCodeDtoSchema } from '@/core/users/domain/dtos/request-code.dto'
import { UsersFactory } from '@/http/factory/users-factory'

export async function requestCode(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users/sessions/code',
    {
      schema: {
        body: RequestAuthCodeDtoSchema,
        response: {
          200: z.object({
            token: z.string().uuid(),
          }),
        },
      },
    },
    async (request, replay) => {
      const service = UsersFactory.makeService()
      const { authToken } = await service.requestCode(request.body)
      return replay.send({
        token: authToken.id,
      })
    },
  )
}
