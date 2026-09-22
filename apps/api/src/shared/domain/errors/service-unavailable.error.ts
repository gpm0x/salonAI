import { DomainError } from "./domain-error"

export class ServiceUnavailableError extends DomainError {
  readonly statusCode = 503
  readonly code = "SERVICE_UNAVAILABLE"

  constructor(message: string) {
    super(message)
  }
}
