export interface ProfessionalItemDTO {
  id: string
  nome: string
  especialidade: string | null
  email: string | null
  telefone: string | null
  status: string
  desde: string | null
  comissao: number
  avaliacao: number
  servicos: string[]
  dias: string[]
  horario: string | null
  unidade: string | null
  atendimentosMes: number
  faturamentoMes: number
  ocupacao: number
}
