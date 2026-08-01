import { ValidationError } from "../errors"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class Email {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): Email {
    const trimmed = value.trim().toLowerCase()
    if (!EMAIL_REGEX.test(trimmed)) {
      throw new ValidationError(`Email invalido: ${value}`)
    }
    return new Email(trimmed)
  }

  toString(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }
}
