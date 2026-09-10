export interface TransactionItemDTO {
  id: string
  data: string
  cliente: string | null
  servico: string | null
  profissional: string | null
  forma: string
  valor: number
}
