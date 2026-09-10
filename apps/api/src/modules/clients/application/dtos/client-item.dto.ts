export interface ClientItemDTO {
  id: string
  nome: string
  email: string | null
  telefone: string | null
  status: string
  dataCadastro: string
  aniversario: string | null
  servicoFavorito: string | null
  profissionalPreferido: string | null
  ultimaVisita: string | null
  totalVisitas: number
  totalGasto: number
}
