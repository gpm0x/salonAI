import type { FastifyInstance } from "fastify"
import { authenticateUser } from "@/shared/infrastructure/plugins/auth.plugin"
import { getOnboardingStatusController } from "./onboarding.controller"

export async function onboardingRoutes(fastify: FastifyInstance) {
  // authenticateUser (nao authenticate): usuario ainda pode nao ter organizacao.
  fastify.get("/status", { preHandler: [authenticateUser] }, getOnboardingStatusController)
}
