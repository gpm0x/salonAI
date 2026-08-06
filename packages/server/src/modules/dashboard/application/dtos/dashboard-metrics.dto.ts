export interface DashboardMetricsDTO {
  resumoDia: {
    variacao: number
    novosClientes: number
    proximo: { hora: string; cliente: string } | null
    porStatus: Array<{ status: string; total: number }>
  }
  faturamento: {
    hoje: number
    metaDia: number
    semana: number
    variacaoSemana: number
    serie: number[]
  }
  ocupacao: {
    taxa: number
    cadeirasOcupadas: number
    cadeirasTotais: number
    variacao: number
  }
  tempoMedio: {
    minutos: number
    variacao: number
    porServico: Array<{ nome: string; minutos: number }>
  }
  agendaHoje: Array<{
    hora: string
    cliente: string
    servico: string
    profissional: string
    status: string
  }>
  profissionais: Array<{
    nome: string
    especialidade: string | null
    atendimentos: number
    faturamento: number
    ocupacao: number
  }>
}
