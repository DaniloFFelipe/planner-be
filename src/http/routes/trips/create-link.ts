import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/common/core/errors/bad-request-error'
import { prisma } from '@/common/prisma/prisma'
import { auth } from '@/http/middlewares/auth.middleware'

export async function createLink(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/trips/:tripId/links',
      {
        schema: {
          params: z.object({
            tripId: z.string().uuid(),
          }),
          body: z.object({
            title: z.string().min(4),
            url: z.string().url(),
          }),
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()
        const { tripId } = request.params
        const { title, url } = request.body

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
        if (trip.participants.length >= 1) {
          throw new BadRequestError('User is not on trip')
        }

        const link = await prisma.link.create({
          data: {
            title,
            url,
            trip_id: tripId,
          },
        })

        return { linkId: link.id }
      },
    )
}
