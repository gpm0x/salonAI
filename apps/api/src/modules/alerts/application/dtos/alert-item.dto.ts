export interface AlertItemDTO {
  id: string
  area: string
  tom: string
  titulo: string
  descricao: string
  impacto: number
  confianca: number
  acao: string | null
  lido: boolean
  criadoEm: string
}
