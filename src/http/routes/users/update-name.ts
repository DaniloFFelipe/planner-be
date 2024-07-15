import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { UsersFactory } from '@/http/factory/users-factory'
import { auth } from '@/http/middlewares/auth.middleware'

export async function updateUserName(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/users/name',
      {
        schema: {
          body: z.object({
            name: z.string().min(3),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const service = UsersFactory.makeService()
        await service.updateUserName(request.body.name, userId)
        return reply.status(204).send()
      },
    )
}
