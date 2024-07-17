import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/common/core/errors/bad-request-error'
import { prisma } from '@/common/prisma/prisma'
import { auth } from '@/http/middlewares/auth.middleware'

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/trips/:tripId/invites',
      {
        schema: {
          params: z.object({
            tripId: z.string().uuid(),
          }),
          body: z.object({
            email: z.string().email(),
          }),
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()
        const { tripId } = request.params
        const { email } = request.body

        const trip = await prisma.trip.findUnique({
          where: { id: tripId },
          include: {
            participants: {
              where: {
                user: {
                  email,
                },
              },
            },
            invites: {
              where: {
                email,
              },
            },
          },
        })

        if (!trip) {
          throw new BadRequestError('Trip not found')
        }

        const me = await prisma.participant.findUnique({
          where: {
            user_id_trip_id: {
              user_id: userId,
              trip_id: trip.id,
            },
          },
        })

        if (!me) {
          throw new BadRequestError('User is not on trip')
        }

        if (trip.invites.length > 0) {
          throw new BadRequestError('User already invited')
        }

        if (trip.participants.length > 0) {
          throw new BadRequestError('User is already on the trip')
        }

        const invite = await prisma.invite.create({
          data: {
            email,
            trip_id: tripId,
          },
        })

        return { inviteId: invite.id }
      },
    )
}
