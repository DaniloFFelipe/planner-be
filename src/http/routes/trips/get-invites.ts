import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/common/core/errors/bad-request-error'
import { prisma } from '@/common/prisma/prisma'
import { auth } from '@/http/middlewares/auth.middleware'

export async function getInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/trips/:tripId/invites',
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
              where: {
                user_id: userId,
              },
            },
            invites: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        })

        if (!trip) {
          throw new BadRequestError('Trip not found')
        }

        if (trip.participants.length >= 1) {
          throw new BadRequestError('User is not on trip')
        }

        return { invites: trip.invites }
      },
    )
}
