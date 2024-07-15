import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/common/prisma/prisma'
import { auth } from '@/http/middlewares/auth.middleware'

export async function getUserInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/me/invites', async (request) => {
      const user = await request.getUser()

      const invites = await prisma.invite.findMany({
        where: { email: user.email },
        include: {
          trip: {
            select: {
              destination: true,
              ends_at: true,
              starts_at: true,
            },
          },
        },
      })

      return { invites }
    })
}
