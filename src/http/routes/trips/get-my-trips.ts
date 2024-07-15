import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/common/prisma/prisma'
import { auth } from '@/http/middlewares/auth.middleware'

export async function getMyTrips(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/me/trips', async (request) => {
      const userId = await request.getCurrentUserId()

      const trips = await prisma.trip.findMany({
        where: {
          participants: {
            some: {
              user_id: userId,
            },
          },
        },
      })

      return { trips }
    })
}
