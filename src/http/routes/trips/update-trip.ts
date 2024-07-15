import dayjs from 'dayjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/common/core/errors/bad-request-error'
import { prisma } from '@/common/prisma/prisma'

export async function updateTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/trips/:tripId',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
        }),
      },
    },
    async (request) => {
      const userId = await request.getCurrentUserId()
      const { tripId } = request.params
      const { destination, starts_at, ends_at } = request.body

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          participants: {
            where: {
              user_id: userId,
            },
            take: 1,
          },
        },
      })

      if (!trip) {
        throw new BadRequestError('Trip not found')
      }

      if (trip.participants.length >= 1) {
        throw new BadRequestError('User is not on trip')
      }

      if (!trip.participants[0].is_owner) {
        throw new BadRequestError('User is not the owner of the trip')
      }

      if (dayjs(starts_at).isBefore(new Date())) {
        throw new BadRequestError('Invalid trip start date.')
      }

      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new BadRequestError('Invalid trip end date.')
      }

      await prisma.trip.update({
        where: { id: tripId },
        data: {
          destination,
          starts_at,
          ends_at,
        },
      })

      return { tripId: trip.id }
    },
  )
}
