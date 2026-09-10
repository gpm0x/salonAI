export interface SalonItemDTO {
  id: string
  nome: string
  endereco: string | null
  cidade: string | null
  telefone: string | null
  horario: string | null
  cadeiras: number
  ativa: boolean
  principal: boolean
  profissionais: number
  atendimentosMes: number
  atendimentosDia: number
  faturamentoMes: number
  faturamentoDia: number
  ocupacao: number
}
