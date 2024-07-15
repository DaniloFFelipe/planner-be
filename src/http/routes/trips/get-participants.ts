import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/common/core/errors/bad-request-error'
import { prisma } from '@/common/prisma/prisma'
import { auth } from '@/http/middlewares/auth.middleware'

export async function getParticipants(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/trips/:tripId/participants',
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
          where: { id: tripId },
          include: {
            participants: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  },
                },
              },
            },
          },
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

        return { participants: trip.participants }
      },
    )
}
