import { ValidationError } from "../errors"

export class Phone {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): Phone {
    const digits = value.replace(/\D/g, "")
    if (digits.length < 10 || digits.length > 11) {
      throw new ValidationError(`Telefone invalido: ${value}`)
    }
    return new Phone(digits)
  }

  formatted(): string {
    const d = this.value
    if (d.length === 11) {
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
    }
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  }

  toString(): string {
    return this.value
  }

  equals(other: Phone): boolean {
    return this.value === other.value
  }
}
