import { DomainError } from "./domain-error"

export class UnauthorizedError extends DomainError {
  readonly statusCode = 401
  readonly code = "UNAUTHORIZED"

  constructor(message = "Nao autorizado") {
    super(message)
  }
}
