import type { UseCase } from "@/shared/application/use-case"
import type { ISalonRepository } from "../../domain/salon.repository"
import { Salon } from "../../domain/salon.entity"
import type { CreateSalonInput } from "../dtos/create-salon.dto"
import { slugify } from "@/shared/utils/slugify"
import { ConflictError } from "@/shared/domain/errors"

interface Input extends CreateSalonInput { organizationId: string }
interface Output { salonId: string; slug: string }

const MAX_SLUG_ATTEMPTS = 5

export class CreateSalonUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: ISalonRepository) {}

  async execute(input: Input): Promise<Output> {
    if (input.principal) await this.repo.clearMainSalon(input.organizationId)

    const base = slugify(input.nome)

    // Tenta criar direto (sem checar disponibilidade antes) e deixa o unique
    // constraint do banco decidir: evita a corrida entre "slug esta livre" e
    // "cria com esse slug" quando duas unidades de nome igual sao criadas
    // ao mesmo tempo. Em conflito, tenta o proximo sufixo.
    for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
      const slug = attempt === 0 ? base : `${base}-${attempt + 1}`

      const salon = Salon.create({
        organizationId: input.organizationId,
        name: input.nome,
        slug,
        address: input.endereco,
        city: input.cidade,
        phone: input.telefone,
        businessHours: input.horario,
        totalChairs: input.cadeiras ?? 1,
        isMain: input.principal ?? false,
      })

      try {
        await this.repo.create(salon)
        return { salonId: salon.id, slug: salon.slug }
      } catch (err) {
        const isLastAttempt = attempt === MAX_SLUG_ATTEMPTS - 1
        if (!(err instanceof ConflictError) || isLastAttempt) throw err
      }
    }

    // Inalcancavel: o loop sempre retorna ou lanca antes de terminar.
    throw new ConflictError("Nao foi possivel gerar um slug unico para a unidade")
  }
}
