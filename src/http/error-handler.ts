import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

import { AppError } from '@/common/core/errors/app-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  console.log('ERROR: ', error)

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Invalid input',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    })
  }

  return reply.status(500).send({ message: 'Internal server error' })
}
