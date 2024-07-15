import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/common/core/errors/bad-request-error'
import { prisma } from '@/common/prisma/prisma'
import { auth } from '@/http/middlewares/auth.middleware'

export async function confirmParticipants(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/invite/:inviteId/confirm',
      {
        schema: {
          params: z.object({
            inviteId: z.string().uuid(),
          }),
        },
      },
      async (request, reply) => {
        const { inviteId } = request.params
        const userId = await request.getCurrentUserId()

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
          },
        })

        if (!invite) {
          throw new BadRequestError('Invite not found.')
        }

        const participant = await prisma.participant.create({
          data: {
            trip_id: invite.trip_id,
            user_id: userId,
          },
        })

        await prisma.invite.delete({
          where: {
            id: invite.id,
          },
        })

        return reply.send({ participantId: participant.id })
      },
    )
}
