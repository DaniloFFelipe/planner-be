import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

import { UnauthorizedError } from '@/common/core/errors/unauthorized-error'
import { prisma } from '@/common/prisma/prisma'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()
        return sub
      } catch {
        throw new UnauthorizedError('Invalid token')
      }
    }

    request.getUser = async () => {
      const userId = await request.getCurrentUserId()
      try {
        const user = await prisma.user.findUniqueOrThrow({
          where: {
            id: userId,
          },
        })

        return user
      } catch {
        throw new UnauthorizedError('Invalid token')
      }
    }
  })
})
