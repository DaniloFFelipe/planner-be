import type { FastifyInstance } from 'fastify'

import { confirmParticipants } from './trips/confirm-invite'
import { createActivity, createActivity } from './trips/create-activity'
import { createInvite } from './trips/create-invites'
import { createLink } from './trips/create-link'
import { createTrip } from './trips/create-trip'
import { getActivities } from './trips/get-activities'
import { getInvites } from './trips/get-invites'
import { getLinks } from './trips/get-links'
import { getMyTrips } from './trips/get-my-trips'
import { getParticipant } from './trips/get-participant'
import { getParticipants } from './trips/get-participants'
import { getTripDetails } from './trips/get-trip-details'
import { getUserInvites } from './trips/get-user-invites'
import { rejectInvite } from './trips/reject-invite'
import { revokeInvite } from './trips/revoke-invite'
import { updateTrip } from './trips/update-trip'
import { authentication } from './users/auth.route'
import { me } from './users/me.route'
import { requestCode } from './users/request-code.route'
import { updateUserName } from './users/update-name'

export async function routes(app: FastifyInstance) {
  app.register(requestCode)
  app.register(authentication)
  app.register(me)
  app.register(updateUserName)

  app.register(getUserInvites)
  app.register(confirmParticipants)
  app.register(createActivity)
  app.register(getMyTrips)
  app.register(createInvite)
  app.register(createLink)
  app.register(createTrip)
  app.register(getActivities)
  app.register(getInvites)
  app.register(getLinks)
  app.register(getParticipant)
  app.register(getParticipants)
  app.register(getTripDetails)
  app.register(rejectInvite)
  app.register(revokeInvite)
  app.register(updateTrip)
}
