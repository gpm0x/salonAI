import { randomUUID } from "node:crypto"

export abstract class Entity<Props> {
  protected readonly _id: string
  protected readonly props: Props
  protected readonly _createdAt: Date
  protected _updatedAt: Date

  constructor(props: Props, id?: string) {
    this._id = id ?? randomUUID()
    this.props = props
    this._createdAt = new Date()
    this._updatedAt = new Date()
  }

  get id(): string {
    return this._id
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  equals(entity: Entity<Props>): boolean {
    return this._id === entity._id
  }
}
