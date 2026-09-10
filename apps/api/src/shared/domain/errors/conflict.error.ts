import { DomainError } from "./domain-error"

export class ConflictError extends DomainError {
  readonly statusCode = 409
  readonly code = "CONFLICT"

  constructor(message: string) {
    super(message)
  }
}
