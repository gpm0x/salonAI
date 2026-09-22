import type { FastifyInstance } from "fastify"
import { authenticate } from "@/shared/infrastructure/plugins/auth.plugin"
import { requirePlan } from "@/shared/infrastructure/plugins/require-plan.plugin"
import { requireRole } from "@/shared/infrastructure/plugins/require-role.plugin"
import {
  listTransactionsController,
  getTransactionSummaryController,
  getTransactionController,
  createTransactionController,
  getTransactionReportController,
} from "./transaction.controller"

export async function transactionRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate)
  fastify.addHook("preHandler", requireRole("admin"))
  fastify.addHook("preHandler", requirePlan("essencial"))

  fastify.get("/", listTransactionsController)
  fastify.post("/", createTransactionController)
  fastify.get("/resumo", getTransactionSummaryController)
  fastify.get("/report", getTransactionReportController)
  fastify.get("/:id", getTransactionController)
}
