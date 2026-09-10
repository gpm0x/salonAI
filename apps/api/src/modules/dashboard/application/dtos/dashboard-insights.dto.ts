export interface DashboardInsightsDTO {
  data: Array<{
    id: string
    area: string
    tom: string
    titulo: string
    descricao: string
    impacto: number
    confianca: number
    acao: string | null
  }>
  resumo: {
    total: number
    oportunidades: number
    riscos: number
    impactoPotencial: number
    receitaEmRisco: number
    confiancaMedia: number
  }
}
