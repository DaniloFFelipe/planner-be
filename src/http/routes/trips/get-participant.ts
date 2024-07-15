import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/common/core/errors/bad-request-error'
import { prisma } from '@/common/prisma/prisma'
import { auth } from '@/http/middlewares/auth.middleware'

export async function getParticipant(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/participants/:participantId',
      {
        schema: {
          params: z.object({
            participantId: z.string().uuid(),
          }),
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()
        const { participantId } = request.params

        const participant = await prisma.participant.findUnique({
          select: {
            id: true,
            trip_id: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
          where: { id: participantId },
        })

        if (!participant) {
          throw new BadRequestError('Participant not found')
        }

        const me = await prisma.participant.findUnique({
          where: {
            user_id_trip_id: {
              user_id: userId,
              trip_id: participant.trip_id,
            },
          },
        })

        if (!me) {
          throw new BadRequestError('User is not on trip')
        }

        return { participant }
      },
    )
}
