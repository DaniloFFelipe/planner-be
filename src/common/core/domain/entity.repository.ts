import { Entity } from './entity'

export abstract class EntityRepository<E extends Entity<unknown>> {
  abstract findById(id: string): Promise<E | null>
  abstract create(entity: E): Promise<void>
  abstract save(entity: E): Promise<void>
  abstract delete(id: string): Promise<void>
}
