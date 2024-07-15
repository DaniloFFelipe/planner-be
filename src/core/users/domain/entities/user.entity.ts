import { Entity } from '@/common/core/domain/entity'

export interface UserProps {
  email: string
  name?: string | null
}

export class User extends Entity<UserProps> {
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
    }
  }

  get email() {
    return this.props.email
  }

  get name() {
    return this.props.name
  }

  set name(value: string | null | undefined) {
    this.props.name = value
  }

  static create(props: UserProps, id?: string) {
    return new User(props, id)
  }
}
