import type { PrismaClient } from "@prisma/client"
import { Transaction } from "../../domain/transaction.entity"
import type { ITransactionRepository } from "../../domain/transaction.repository"
import type { TransactionItemDTO } from "../../application/dtos/transaction-item.dto"
import type { TransactionSummaryDTO } from "../../application/dtos/transaction-summary.dto"

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

    const historico: TransactionSummaryDTO["historico"] = []
    for (let i = 11; i >= 0; i--) {
      const hStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const hEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999)
      const [txs, appts] = await Promise.all([
        this.prisma.transaction.aggregate({
          where: { organizationId, paidAt: { gte: hStart, lte: hEnd } },
          _sum: { amountCents: true },
        }),
        this.prisma.appointment.count({
          where: { organizationId, status: "concluido", startsAt: { gte: hStart, lte: hEnd } },
        }),
      ])
      historico.push({
        mes: MES_NAMES[hStart.getMonth()],
        receita: (txs._sum.amountCents ?? 0) / 100,
        atendimentos: appts,
      })
    }

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
}
