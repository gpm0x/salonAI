import type { UseCase } from "@/shared/application/use-case"
import type { ITransactionRepository } from "../../domain/transaction.repository"
import { Transaction } from "../../domain/transaction.entity"
import type { CreateTransactionInput } from "../dtos/create-transaction.dto"
import { NotFoundError } from "@/shared/domain/errors"
import { prisma } from "@/shared/infrastructure/prisma/client"

interface Input extends CreateTransactionInput { organizationId: string }
interface Output { transactionId: string }

export class CreateTransactionUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: ITransactionRepository) {}

  async execute(input: Input): Promise<Output> {
    // Verifica que os recursos referenciados pertencem à organização (previne IDOR)
    if (input.clienteId) {
      const client = await prisma.client.findFirst({
        where: { id: input.clienteId, organizationId: input.organizationId },
      })
      if (!client) throw new NotFoundError("Cliente nao encontrado")
    }

    if (input.profissionalId) {
      const professional = await prisma.professional.findFirst({
        where: { id: input.profissionalId, organizationId: input.organizationId },
      })
      if (!professional) throw new NotFoundError("Profissional nao encontrado")
    }

    if (input.appointmentId) {
      const appointment = await prisma.appointment.findFirst({
        where: { id: input.appointmentId, organizationId: input.organizationId },
      })
      if (!appointment) throw new NotFoundError("Agendamento nao encontrado")
    }

    // paidAt aceita apenas datas passadas (até 1 ano atrás) — previne timestamp injection
    let paidAt = new Date()
    if (input.data) {
      const parsed = new Date(input.data)
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      if (isNaN(parsed.getTime()) || parsed > new Date() || parsed < oneYearAgo) {
        paidAt = new Date()
      } else {
        paidAt = parsed
      }
    }

    const transaction = Transaction.create({
      organizationId: input.organizationId,
      appointmentId: input.appointmentId,
      clientId: input.clienteId,
      professionalId: input.profissionalId,
      serviceName: input.servico,
      amountCents: Math.round(input.valor * 100),
      paymentMethod: input.forma,
      paidAt,
    })

    await this.repo.create(transaction)
    return { transactionId: transaction.id }
  }
}
