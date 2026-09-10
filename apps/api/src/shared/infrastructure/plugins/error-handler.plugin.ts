import type { FastifyInstance } from "fastify"
import fp from "fastify-plugin"
import { ZodError } from "zod"
import { DomainError } from "../../domain/errors"

async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: unknown, _request, reply) => {
    if (error instanceof DomainError) {
      return reply.status(error.statusCode).send({
        code: error.code,
        message: error.message,
      })
    }

    if (error instanceof ZodError) {
      return reply.status(422).send({
        code: "VALIDATION_ERROR",
        message: "Dados invalidos",
        details: error.flatten().fieldErrors,
      })
    }

    const err = error as { statusCode?: number; code?: string; message?: string }
    if (err.statusCode && err.statusCode < 500) {
      return reply.status(err.statusCode).send({
        code: err.code ?? "CLIENT_ERROR",
        message: err.message,
      })
    }

    fastify.log.error(error)
    return reply.status(500).send({
      code: "INTERNAL_ERROR",
      message: "Erro interno do servidor",
    })
  })
}

export default fp(errorHandlerPlugin, { name: "error-handler" })
