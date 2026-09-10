import type { FastifyInstance } from "fastify"
import { authenticate } from "@/shared/infrastructure/plugins/auth.plugin"
import {
  listTransactionsController,
  getTransactionSummaryController,
  getTransactionController,
  createTransactionController,
} from "./transaction.controller"

export async function transactionRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate)

  fastify.get("/", listTransactionsController)
  fastify.post("/", createTransactionController)
  fastify.get("/resumo", getTransactionSummaryController)
  fastify.get("/:id", getTransactionController)
}
