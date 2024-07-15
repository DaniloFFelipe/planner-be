import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { UsersFactory } from '@/http/factory/users-factory'
import { auth } from '@/http/middlewares/auth.middleware'

export async function me(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/users/me', {}, async (request, reply) => {
      const userId = await request.getCurrentUserId()
      const service = UsersFactory.makeService()
      const user = await service.findById(userId)
      return reply.send({ user })
    })
}
