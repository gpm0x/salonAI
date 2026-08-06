export interface TransactionSummaryDTO {
  receita: number
  despesa: number
  lucro: number
  margem: number
  ticketMedio: number
  atendimentos: number
  variacaoReceita: number
  variacaoLucro: number
  variacaoTicket: number
  variacaoAtendimentos: number
  formasPagamento: Array<{ nome: string; valor: number; percentual: number }>
  historico: Array<{ mes: string; receita: number; atendimentos: number }>
}
