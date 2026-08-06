import type { UseCase } from "@/shared/application/use-case"
import type { ITransactionRepository } from "../../domain/transaction.repository"
import { Transaction } from "../../domain/transaction.entity"
import type { CreateTransactionInput } from "../dtos/create-transaction.dto"

interface Input extends CreateTransactionInput { organizationId: string }
interface Output { transactionId: string }

export class CreateTransactionUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: ITransactionRepository) {}

  async execute(input: Input): Promise<Output> {
    const transaction = Transaction.create({
      organizationId: input.organizationId,
      appointmentId: input.appointmentId,
      clientId: input.clienteId,
      professionalId: input.profissionalId,
      serviceName: input.servico,
      amountCents: Math.round(input.valor * 100),
      paymentMethod: input.forma,
      paidAt: input.data ? new Date(input.data) : new Date(),
    })

    await this.repo.create(transaction)
    return { transactionId: transaction.id }
  }
}
