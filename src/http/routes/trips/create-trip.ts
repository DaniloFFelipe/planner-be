import dayjs from 'dayjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/common/core/errors/bad-request-error'
import { prisma } from '@/common/prisma/prisma'
import { auth } from '@/http/middlewares/auth.middleware'

export async function createTrip(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/trips',
      {
        schema: {
          body: z.object({
            destination: z.string().min(4),
            starts_at: z.coerce.date(),
            ends_at: z.coerce.date(),
            emails_to_invite: z.array(z.string().email()),
          }),
        },
      },
      async (request) => {
        const { destination, starts_at, ends_at, emails_to_invite } =
          request.body
        const userId = await request.getCurrentUserId()

        if (dayjs(starts_at).isBefore(new Date())) {
          throw new BadRequestError('Invalid trip start date.')
        }

        if (dayjs(ends_at).isBefore(starts_at)) {
          throw new BadRequestError('Invalid trip end date.')
        }

        const trip = await prisma.trip.create({
          data: {
            destination,
            starts_at,
            ends_at,
            invites: {
              createMany: {
                data: emails_to_invite.map((email) => {
                  return { email }
                }),
              },
            },
            participants: {
              createMany: {
                data: [
                  {
                    user_id: userId,
                    is_owner: true,
                  },
                ],
              },
            },
          },
        })

        return { tripId: trip.id }
      },
    )
}
