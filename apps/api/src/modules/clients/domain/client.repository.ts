import type { Client } from "./client.entity"
import type { ClientItemDTO } from "../application/dtos/client-item.dto"

export interface IClientRepository {
  create(client: Client): Promise<void>
  list(organizationId: string, monthStart: Date, monthEnd: Date, search?: string): Promise<ClientItemDTO[]>
  findByIdWithMetrics(id: string, organizationId: string): Promise<ClientItemDTO | null>
  findById(id: string, organizationId: string): Promise<Client | null>
  update(client: Client): Promise<void>
  softDelete(id: string, organizationId: string): Promise<void>
  /** Usado pelo booking publico (BACK-02): busca cliente existente por telefone na org, ou cria um novo. */
  findOrCreateByPhone(organizationId: string, phone: string, name: string): Promise<Client>
}
