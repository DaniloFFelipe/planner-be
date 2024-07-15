import 'fastify'

import { User } from '@prisma/client'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
    getUser(): Promise<User>
  }
}
