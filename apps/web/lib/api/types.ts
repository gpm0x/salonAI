/**
 * Espelho dos DTOs expostos por `apps/api`.
 *
 * A fonte da verdade é `apps/api/src/modules/<domínio>/application/dtos/`.
 * Ao mudar um DTO lá, atualize aqui — ou rode `pnpm generate:api`, que gera
 * o client a partir do OpenAPI servido em `/docs/json` e dispensa este arquivo.
 */

/** Listagens da API sempre vêm envelopadas em `{ data }`. */
export interface Lista<T> {
  data: T[];
}

// ── Dashboard ────────────────────────────────────────

export interface DashboardMetrics {
  resumoDia: {
    variacao: number;
    novosClientes: number;
    proximo: { hora: string; cliente: string } | null;
    porStatus: Array<{ status: string; total: number }>;
  };
  faturamento: {
    hoje: number;
    metaDia: number;
    semana: number;
    variacaoSemana: number;
    serie: number[];
  };
  ocupacao: {
    taxa: number;
    cadeirasOcupadas: number;
    cadeirasTotais: number;
    variacao: number;
  };
  tempoMedio: {
    minutos: number;
    variacao: number;
    porServico: Array<{ nome: string; minutos: number }>;
  };
  agendaHoje: Array<{
    hora: string;
    cliente: string;
    servico: string;
    profissional: string;
    status: string;
  }>;
  profissionais: Array<{
    nome: string;
    especialidade: string | null;
    atendimentos: number;
    faturamento: number;
    ocupacao: number;
  }>;
}

export interface DashboardInsights {
  data: Array<{
    id: string;
    area: string;
    tom: string;
    titulo: string;
    descricao: string;
    impacto: number;
    confianca: number;
    acao: string | null;
  }>;
  resumo: {
    total: number;
    oportunidades: number;
    riscos: number;
    impactoPotencial: number;
    receitaEmRisco: number;
    confiancaMedia: number;
  };
}

// ── Clientes ─────────────────────────────────────────

export interface ClientItem {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  status: string;
  dataCadastro: string;
  aniversario: string | null;
  servicoFavorito: string | null;
  profissionalPreferido: string | null;
  ultimaVisita: string | null;
  totalVisitas: number;
  totalGasto: number;
}

export interface CreateClientInput {
  nome: string;
  email?: string;
  telefone?: string;
  aniversario?: string;
}

export type UpdateClientInput = Partial<CreateClientInput> & {
  status?: string;
};

// ── Agendamentos ─────────────────────────────────────

export interface AppointmentItem {
  id: string;
  data: string;
  inicio: string;
  fim: string;
  duracao: number;
  cliente: string;
  clienteId: string;
  servico: string;
  servicoId: string;
  profissional: string;
  profissionalId: string;
  unidade: string;
  salonId: string;
  status: string;
  valor: number;
  observacoes: string | null;
}

export interface CreateAppointmentInput {
  clientId: string;
  serviceId: string;
  professionalId: string;
  salonId: string;
  /** ISO 8601 */
  startsAt: string;
  observacoes?: string;
}

// ── Profissionais ────────────────────────────────────

export interface ProfessionalItem {
  id: string;
  nome: string;
  especialidade: string | null;
  email: string | null;
  telefone: string | null;
  status: string;
  desde: string | null;
  comissao: number;
  avaliacao: number;
  servicos: string[];
  dias: string[];
  horario: string | null;
  unidade: string | null;
  atendimentosMes: number;
  faturamentoMes: number;
  ocupacao: number;
}

// ── Serviços ─────────────────────────────────────────

export interface ServiceItem {
  id: string;
  nome: string;
  categoria: string;
  duracao: number;
  preco: number;
  comissao: number;
  ativo: boolean;
  realizadosMes: number;
}

// ── Unidades (salons) ────────────────────────────────

export interface SalonItem {
  id: string;
  nome: string;
  endereco: string | null;
  cidade: string | null;
  telefone: string | null;
  horario: string | null;
  cadeiras: number;
  ativa: boolean;
  principal: boolean;
  profissionais: number;
  atendimentosMes: number;
  atendimentosDia: number;
  faturamentoMes: number;
  faturamentoDia: number;
  ocupacao: number;
}

// ── Transações ───────────────────────────────────────

export interface TransactionItem {
  id: string;
  data: string;
  cliente: string | null;
  servico: string | null;
  profissional: string | null;
  forma: string;
  valor: number;
}

export interface TransactionSummary {
  receita: number;
  despesa: number;
  lucro: number;
  margem: number;
  ticketMedio: number;
  atendimentos: number;
  variacaoReceita: number;
  variacaoLucro: number;
  variacaoTicket: number;
  variacaoAtendimentos: number;
  formasPagamento: Array<{ nome: string; valor: number; percentual: number }>;
  historico: Array<{ mes: string; receita: number; atendimentos: number }>;
}

// ── Alertas ──────────────────────────────────────────

export interface AlertItem {
  id: string;
  area: string;
  tom: string;
  titulo: string;
  descricao: string;
  impacto: number;
  confianca: number;
  acao: string | null;
  lido: boolean;
  criadoEm: string;
}

// ── Organização ──────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  subscriptionStatus:
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | (string & {});
}
