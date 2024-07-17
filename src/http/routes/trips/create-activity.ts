import dayjs from 'dayjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/common/core/errors/bad-request-error'
import { prisma } from '@/common/prisma/prisma'
import { auth } from '@/http/middlewares/auth.middleware'

export async function createActivity(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/trips/:tripId/activities',
      {
        schema: {
          params: z.object({
            tripId: z.string().uuid(),
          }),
          body: z.object({
            title: z.string().min(4),
            occurs_at: z.coerce.date(),
          }),
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()
        const { tripId } = request.params
        const { title, occurs_at } = request.body

        const trip = await prisma.trip.findUnique({
          where: { id: tripId },
          include: {
            participants: {
              where: {
                user_id: userId,
              },
            },
          },
        })

        if (!trip) {
          throw new BadRequestError('Trip not found')
        }

        if (trip.participants.length < 1) {
          throw new BadRequestError('User is not on trip')
        }

        if (dayjs(occurs_at).isBefore(trip.starts_at)) {
          throw new BadRequestError('Invalid activity date.')
        }

        if (dayjs(occurs_at).isAfter(trip.ends_at)) {
          throw new BadRequestError('Invalid activity date.')
        }

        const activity = await prisma.activity.create({
          data: {
            title,
            occurs_at,
            trip_id: tripId,
          },
        })

        return { activityId: activity.id }
      },
    )
}
