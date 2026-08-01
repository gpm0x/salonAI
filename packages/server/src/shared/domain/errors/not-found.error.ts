import { DomainError } from "./domain-error"

export class NotFoundError extends DomainError {
  readonly statusCode = 404
  readonly code = "NOT_FOUND"

  constructor(entity: string, id?: string) {
    super(id ? `${entity} com id "${id}" nao encontrado` : `${entity} nao encontrado`)
  }
}
