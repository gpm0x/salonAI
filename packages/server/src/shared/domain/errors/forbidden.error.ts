import { DomainError } from "./domain-error"

export class ForbiddenError extends DomainError {
  readonly statusCode = 403
  readonly code = "FORBIDDEN"

  constructor(message = "Acesso negado") {
    super(message)
  }
}
