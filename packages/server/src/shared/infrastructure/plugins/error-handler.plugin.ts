import type { FastifyInstance } from "fastify"
import fp from "fastify-plugin"
import { ZodError } from "zod"
import { DomainError } from "../../domain/errors"

async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error, _request, reply) => {
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

    if (error.statusCode && error.statusCode < 500) {
      return reply.status(error.statusCode).send({
        code: error.code ?? "CLIENT_ERROR",
        message: error.message,
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
