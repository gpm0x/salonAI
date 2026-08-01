import { ValidationError } from "../errors"

export class Money {
  private readonly cents: number

  private constructor(cents: number) {
    this.cents = cents
  }

  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents) || cents < 0) {
      throw new ValidationError(`Valor em centavos invalido: ${cents}`)
    }
    return new Money(cents)
  }

  static fromReais(reais: number): Money {
    return new Money(Math.round(reais * 100))
  }

  toCents(): number {
    return this.cents
  }

  toReais(): number {
    return this.cents / 100
  }

  add(other: Money): Money {
    return new Money(this.cents + other.cents)
  }

  equals(other: Money): boolean {
    return this.cents === other.cents
  }
}
