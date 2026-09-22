import type { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { PrismaPublicBookingRepository } from "../infra/prisma/prisma-public-booking.repository"
import { PrismaClientRepository } from "@/modules/clients/infra/prisma/prisma-client.repository"
import { GetPublicSalonUseCase } from "../application/use-cases/get-public-salon.use-case"
import { GetAvailabilityUseCase } from "../application/use-cases/get-availability.use-case"
import { CreatePublicAppointmentUseCase } from "../application/use-cases/create-public-appointment.use-case"
import { availabilityQuerySchema } from "../application/dtos/availability-query.dto"
import { createPublicAppointmentSchema } from "../application/dtos/create-public-appointment.dto"

const makeBookingRepo = () => new PrismaPublicBookingRepository(prisma)
const makeClientRepo = () => new PrismaClientRepository(prisma)

export async function getPublicSalonController(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply,
) {
  const salon = await new GetPublicSalonUseCase(makeBookingRepo()).execute({
    slug: request.params.slug,
  })
  return reply.send(salon)
}

export async function getAvailabilityController(
  request: FastifyRequest<{
    Params: { slug: string }
    Querystring: { date?: string; professionalId?: string; serviceId?: string }
  }>,
  reply: FastifyReply,
) {
  const query = availabilityQuerySchema.parse(request.query)
  const result = await new GetAvailabilityUseCase(makeBookingRepo()).execute({
    slug: request.params.slug,
    ...query,
  })
  return reply.send(result)
}

export async function createPublicAppointmentController(request: FastifyRequest, reply: FastifyReply) {
  const input = createPublicAppointmentSchema.parse(request.body)
  const result = await new CreatePublicAppointmentUseCase(makeBookingRepo(), makeClientRepo()).execute(input)
  return reply.status(201).send(result)
}
