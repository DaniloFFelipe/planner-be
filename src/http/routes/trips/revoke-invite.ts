import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/common/core/errors/bad-request-error'
import { prisma } from '@/common/prisma/prisma'
import { auth } from '@/http/middlewares/auth.middleware'

export async function revokeInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/invite/:inviteId/revoke',
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

        const participant = await prisma.participant.findUnique({
          where: {
            user_id_trip_id: {
              trip_id: invite.trip_id,
              user_id: userId,
            },
          },
        })

        if (!participant) {
          throw new BadRequestError('User is not on trip')
        }

        if (!participant.is_owner) {
          throw new BadRequestError('User is not the owner of the trip')
        }

        await prisma.invite.delete({
          where: {
            id: invite.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
