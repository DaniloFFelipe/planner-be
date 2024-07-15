import dayjs from 'dayjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/common/core/errors/bad-request-error'
import { prisma } from '@/common/prisma/prisma'
import { auth } from '@/http/middlewares/auth.middleware'

export async function getActivities(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/trips/:tripId/activities',
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
            activities: {
              orderBy: {
                occurs_at: 'asc',
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

        const differenceInDaysBetweenTripStartAndEnd = dayjs(trip.ends_at).diff(
          trip.starts_at,
          'days',
        )

        const activities = Array.from({
          length: differenceInDaysBetweenTripStartAndEnd + 1,
        }).map((_, index) => {
          const date = dayjs(trip.starts_at).add(index, 'days')

          return {
            date: date.toDate(),
            activities: trip.activities.filter((activity) => {
              return dayjs(activity.occurs_at).isSame(date, 'day')
            }),
          }
        })

        return { activities }
      },
    )
}
