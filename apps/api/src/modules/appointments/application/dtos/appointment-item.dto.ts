export interface AppointmentItemDTO {
  id: string
  data: string
  inicio: string
  fim: string
  duracao: number
  cliente: string
  clienteId: string
  servico: string
  servicoId: string
  profissional: string
  profissionalId: string
  unidade: string
  salonId: string
  status: string
  valor: number
  observacoes: string | null
}
