import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { AuthenticateDtoSchema } from '@/core/users/domain/dtos/authenticate.dto'
import { UsersFactory } from '@/http/factory/users-factory'

export async function authentication(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users/sessions/auth',
    {
      schema: {
        body: AuthenticateDtoSchema,
        response: {
          200: z.object({
            token: z.string(),
            hasToUpdateName: z.boolean(),
          }),
        },
      },
    },
    async (request, reply) => {
      const service = UsersFactory.makeService()
      const { user } = await service.authenticate(request.body)
      const token = await reply.jwtSign({
        sub: user.id,
      })

      return reply.send({
        hasToUpdateName: !user.name,
        token,
      })
    },
  )
}
