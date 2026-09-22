import { Prisma, type PrismaClient } from "@prisma/client"
import { Transaction } from "../../domain/transaction.entity"
import type { GetReportParams, ITransactionRepository } from "../../domain/transaction.repository"
import type { TransactionItemDTO } from "../../application/dtos/transaction-item.dto"
import type { TransactionSummaryDTO } from "../../application/dtos/transaction-summary.dto"
import type { TransactionReportDTO, TransactionReportPeriodDTO } from "../../application/dtos/transaction-report.dto"

interface ReportRow {
  period: Date
  income_cents: bigint | number | null
  count: bigint | number
}

const MES_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

function pad(n: number) { return String(n).padStart(2, "0") }
function toDate(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` }
function pct(a: number, b: number) { return b === 0 ? 0 : Math.round(((a - b) / b) * 100) }

export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(t: Transaction): Promise<void> {
    await this.prisma.transaction.create({
      data: {
        id: t.id,
        organizationId: t.organizationId,
        appointmentId: t.appointmentId ?? null,
        clientId: t.clientId ?? null,
        professionalId: t.professionalId ?? null,
        serviceName: t.serviceName ?? null,
        amountCents: t.amountCents,
        paymentMethod: t.paymentMethod,
        paidAt: t.paidAt,
      },
    })
  }

  async list(organizationId: string, monthStart: Date, monthEnd: Date): Promise<TransactionItemDTO[]> {
    const rows = await this.prisma.transaction.findMany({
      where: { organizationId, paidAt: { gte: monthStart, lte: monthEnd } },
      orderBy: { paidAt: "desc" },
      include: {
        client: { select: { name: true } },
        professional: { select: { name: true } },
      },
    })

    return rows.map((r) => ({
      id: r.id,
      data: toDate(r.paidAt),
      cliente: r.client?.name ?? null,
      servico: r.serviceName,
      profissional: r.professional?.name ?? null,
      forma: r.paymentMethod,
      valor: r.amountCents / 100,
    }))
  }

  async findById(id: string, organizationId: string): Promise<TransactionItemDTO | null> {
    const r = await this.prisma.transaction.findFirst({
      where: { id, organizationId },
      include: {
        client: { select: { name: true } },
        professional: { select: { name: true } },
      },
    })
    if (!r) return null
    return {
      id: r.id,
      data: toDate(r.paidAt),
      cliente: r.client?.name ?? null,
      servico: r.serviceName,
      profissional: r.professional?.name ?? null,
      forma: r.paymentMethod,
      valor: r.amountCents / 100,
    }
  }

  async getSummary(organizationId: string): Promise<TransactionSummaryDTO> {
    const now = new Date()
    const curStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const curEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

    const [curTxs, prevTxs, curAppts, prevAppts] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { organizationId, paidAt: { gte: curStart, lte: curEnd } },
        select: { amountCents: true, paymentMethod: true },
      }),
      this.prisma.transaction.findMany({
        where: { organizationId, paidAt: { gte: prevStart, lte: prevEnd } },
        select: { amountCents: true },
      }),
      this.prisma.appointment.count({
        where: { organizationId, status: "concluido", startsAt: { gte: curStart, lte: curEnd } },
      }),
      this.prisma.appointment.count({
        where: { organizationId, status: "concluido", startsAt: { gte: prevStart, lte: prevEnd } },
      }),
    ])

    const receita = curTxs.reduce((s, t) => s + t.amountCents, 0) / 100
    const prevReceita = prevTxs.reduce((s, t) => s + t.amountCents, 0) / 100
    const lucro = receita
    const prevLucro = prevReceita
    const margem = receita > 0 ? Math.round((lucro / receita) * 100) : 0
    const ticketMedio = curAppts > 0 ? receita / curAppts : 0
    const prevTicket = prevAppts > 0 ? prevReceita / prevAppts : 0

    const byMethod: Record<string, number> = {}
    for (const t of curTxs) {
      byMethod[t.paymentMethod] = (byMethod[t.paymentMethod] ?? 0) + t.amountCents
    }
    const formasPagamento = Object.entries(byMethod).map(([nome, cents]) => ({
      nome,
      valor: cents / 100,
      percentual: receita > 0 ? Math.round((cents / 100 / receita) * 100) : 0,
    }))

    const historicoRaw = await Promise.all(
      Array.from({ length: 12 }, (_, i) => {
        const offset = 11 - i
        const hStart = new Date(now.getFullYear(), now.getMonth() - offset, 1)
        const hEnd = new Date(now.getFullYear(), now.getMonth() - offset + 1, 0, 23, 59, 59, 999)
        return Promise.all([
          hStart,
          this.prisma.transaction.aggregate({
            where: { organizationId, paidAt: { gte: hStart, lte: hEnd } },
            _sum: { amountCents: true },
          }),
          this.prisma.appointment.count({
            where: { organizationId, status: "concluido", startsAt: { gte: hStart, lte: hEnd } },
          }),
        ])
      }),
    )

    const historico: TransactionSummaryDTO["historico"] = historicoRaw.map(([hStart, txs, appts]) => ({
      mes: MES_NAMES[(hStart as Date).getMonth()],
      receita: ((txs as { _sum: { amountCents: number | null } })._sum.amountCents ?? 0) / 100,
      atendimentos: appts as number,
    }))

    return {
      receita,
      despesa: 0,
      lucro,
      margem,
      ticketMedio,
      atendimentos: curAppts,
      variacaoReceita: pct(receita, prevReceita),
      variacaoLucro: pct(lucro, prevLucro),
      variacaoTicket: pct(ticketMedio, prevTicket),
      variacaoAtendimentos: pct(curAppts, prevAppts),
      formasPagamento,
      historico,
    }
  }

  async getReport(params: GetReportParams): Promise<TransactionReportDTO> {
    const conditions = [
      Prisma.sql`"organizationId" = ${params.organizationId}`,
      Prisma.sql`"paidAt" >= ${params.from}`,
      Prisma.sql`"paidAt" <= ${params.to}`,
    ]
    if (params.professionalId) {
      conditions.push(Prisma.sql`"professionalId" = ${params.professionalId}`)
    }
    if (params.salonId) {
      conditions.push(
        Prisma.sql`"appointmentId" IN (SELECT id FROM "appointment" WHERE "salonId" = ${params.salonId})`,
      )
    }

    const rows = await this.prisma.$queryRaw<ReportRow[]>(
      Prisma.sql`
        SELECT date_trunc(${params.groupBy}, "paidAt") AS period,
               COALESCE(SUM("amountCents"), 0) AS income_cents,
               COUNT(*) AS count
        FROM "transaction"
        WHERE ${Prisma.join(conditions, " AND ")}
        GROUP BY period
        ORDER BY period ASC
      `,
    )

    const data: TransactionReportPeriodDTO[] = rows.map((r) => {
      const incomeCents = Number(r.income_cents ?? 0)
      return {
        period: r.period.toISOString(),
        incomeCents,
        expenseCents: 0,
        netCents: incomeCents,
        count: Number(r.count),
      }
    })

    const totals = data.reduce(
      (acc, row) => ({
        incomeCents: acc.incomeCents + row.incomeCents,
        expenseCents: acc.expenseCents + row.expenseCents,
        netCents: acc.netCents + row.netCents,
        count: acc.count + row.count,
      }),
      { incomeCents: 0, expenseCents: 0, netCents: 0, count: 0 },
    )

    return { data, totals }
  }
}
