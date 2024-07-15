import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/common/core/errors/bad-request-error'
import { prisma } from '@/common/prisma/prisma'
import { auth } from '@/http/middlewares/auth.middleware'

export async function getTripDetails(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/trips/:tripId',
      {
        schema: {
          params: z.object({
            tripId: z.string().uuid(),
          }),
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()
        const { tripId } = request.params

        const trip = await prisma.trip.findUnique({
          select: {
            id: true,
            destination: true,
            starts_at: true,
            ends_at: true,
            is_confirmed: true,
          },
          where: { id: tripId },
        })

        if (!trip) {
          throw new BadRequestError('Trip not found')
        }

        const participant = await prisma.participant.findUnique({
          where: {
            user_id_trip_id: {
              user_id: userId,
              trip_id: trip.id,
            },
          },
        })

        if (!participant) {
          throw new BadRequestError('User is not on trip')
        }

        return { trip }
      },
    )
}
