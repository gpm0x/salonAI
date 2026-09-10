import type { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { PrismaAppointmentRepository } from "../infra/prisma/prisma-appointment.repository"
import { ListAppointmentsUseCase } from "../application/use-cases/list-appointments.use-case"
import { GetAppointmentUseCase } from "../application/use-cases/get-appointment.use-case"
import { CreateAppointmentUseCase } from "../application/use-cases/create-appointment.use-case"
import { UpdateAppointmentStatusUseCase } from "../application/use-cases/update-appointment-status.use-case"
import { CancelAppointmentUseCase } from "../application/use-cases/cancel-appointment.use-case"
import { createAppointmentSchema } from "../application/dtos/create-appointment.dto"
import { updateAppointmentStatusSchema } from "../application/dtos/update-appointment-status.dto"

const makeRepo = () => new PrismaAppointmentRepository(prisma)

export async function listAppointmentsController(
  request: FastifyRequest<{ Querystring: { data?: string } }>,
  reply: FastifyReply,
) {
  const result = await new ListAppointmentsUseCase(makeRepo()).execute({
    organizationId: request.organizationId,
    data: request.query.data,
  })
  return reply.send(result)
}

export async function getAppointmentController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const appointment = await new GetAppointmentUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
  })
  return reply.send(appointment)
}

export async function createAppointmentController(request: FastifyRequest, reply: FastifyReply) {
  const input = createAppointmentSchema.parse(request.body)
  const { appointmentId } = await new CreateAppointmentUseCase(makeRepo()).execute({
    ...input,
    organizationId: request.organizationId,
  })
  return reply.status(201).send({ appointmentId })
}

export async function updateAppointmentStatusController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const input = updateAppointmentStatusSchema.parse(request.body)
  await new UpdateAppointmentStatusUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
    ...input,
  })
  return reply.status(204).send()
}

export async function cancelAppointmentController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  await new CancelAppointmentUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
  })
  return reply.status(204).send()
}
