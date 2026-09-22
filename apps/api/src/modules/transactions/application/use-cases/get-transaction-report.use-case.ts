import type { UseCase } from "@/shared/application/use-case"
import type { ITransactionRepository } from "../../domain/transaction.repository"
import type { TransactionReportDTO } from "../dtos/transaction-report.dto"
import type { TransactionReportQueryInput } from "../dtos/transaction-report-query.dto"
import { NotFoundError, ValidationError } from "@/shared/domain/errors"
import { prisma } from "@/shared/infrastructure/prisma/client"

interface Input extends TransactionReportQueryInput {
  organizationId: string
}

const MAX_WINDOW_DAYS = 366

export class GetTransactionReportUseCase implements UseCase<Input, TransactionReportDTO> {
  constructor(private readonly repo: ITransactionRepository) {}

  async execute(input: Input): Promise<TransactionReportDTO> {
    const from = new Date(`${input.from}T00:00:00`)
    const to = new Date(`${input.to}T23:59:59.999`)

    if (from > to) throw new ValidationError("Data inicial (from) nao pode ser maior que a final (to)")

    const windowDays = (to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000)
    if (windowDays > MAX_WINDOW_DAYS) {
      throw new ValidationError(`Janela maxima de ${MAX_WINDOW_DAYS} dias entre from e to`)
    }

    if (input.salonId) {
      const salon = await prisma.salon.findFirst({
        where: { id: input.salonId, organizationId: input.organizationId },
      })
      if (!salon) throw new NotFoundError("Unidade nao encontrada")
    }

    if (input.professionalId) {
      const professional = await prisma.professional.findFirst({
        where: { id: input.professionalId, organizationId: input.organizationId },
      })
      if (!professional) throw new NotFoundError("Profissional nao encontrado")
    }

    return this.repo.getReport({
      organizationId: input.organizationId,
      from,
      to,
      salonId: input.salonId,
      professionalId: input.professionalId,
      groupBy: input.groupBy,
    })
  }
}
