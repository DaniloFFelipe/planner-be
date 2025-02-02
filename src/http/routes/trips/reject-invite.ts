import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/common/core/errors/bad-request-error'
import { prisma } from '@/common/prisma/prisma'
import { auth } from '@/http/middlewares/auth.middleware'

export async function rejectInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/invite/:inviteId/reject',
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

        const user = await prisma.user.findUniqueOrThrow({
          where: {
            id: userId,
          },
        })

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
          },
        })

        if (!invite) {
          throw new BadRequestError('Invite not found.')
        }

        if (invite.email !== user.email) {
          throw new BadRequestError('Invite is not to this user')
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
