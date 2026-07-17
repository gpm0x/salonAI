// Dados de exemplo para as primeiras telas.
// Substituir por chamadas ao back-end (lib/api-client.ts) quando a API estiver pronta.

export type StatusAgendamento =
  | "confirmado"
  | "aguardando"
  | "em_atendimento"
  | "concluido";

export interface AgendamentoView {
  hora: string;
  cliente: string;
  servico: string;
  profissional: string;
  status: StatusAgendamento;
}

export interface AlertaIA {
  tom: "risco" | "oportunidade" | "info";
  titulo: string;
  descricao: string;
}

export interface ProfissionalView {
  nome: string;
  especialidade: string;
  atendimentos: number;
  faturamento: number;
  ocupacao: number;
}

export const faturamento = {
  hoje: 1840,
  metaDia: 2500,
  semana: 11230,
  variacaoSemana: 12.4,
  // faturamento por dia (seg–dom) para o mini-gráfico
  serie: [980, 1420, 1310, 1760, 2040, 2480, 1240],
};

export const ocupacao = {
  taxa: 78,
  cadeirasOcupadas: 7,
  cadeirasTotais: 9,
  variacao: 5,
};

export const tempoMedio = {
  minutos: 52,
  variacao: -6, // queda é positiva (mais eficiente)
  porServico: [
    { nome: "Corte", minutos: 38 },
    { nome: "Coloração", minutos: 95 },
    { nome: "Escova", minutos: 45 },
  ],
};

export const agendaHoje: AgendamentoView[] = [
  {
    hora: "09:00",
    cliente: "Marina Alves",
    servico: "Corte + Escova",
    profissional: "Rafa",
    status: "concluido",
  },
  {
    hora: "10:30",
    cliente: "Beatriz Nunes",
    servico: "Coloração",
    profissional: "Camila",
    status: "em_atendimento",
  },
  {
    hora: "11:15",
    cliente: "João Pedro",
    servico: "Barba + Corte",
    profissional: "Diego",
    status: "confirmado",
  },
  {
    hora: "13:00",
    cliente: "Larissa Gomes",
    servico: "Hidratação",
    profissional: "Rafa",
    status: "aguardando",
  },
  {
    hora: "14:30",
    cliente: "Fernanda Lima",
    servico: "Mechas",
    profissional: "Camila",
    status: "confirmado",
  },
];

export const alertas: AlertaIA[] = [
  {
    tom: "risco",
    titulo: "3 horários ociosos amanhã à tarde",
    descricao:
      "Camila tem 14h–17h sem agenda. Sugira um disparo de reativação para clientes de coloração.",
  },
  {
    tom: "oportunidade",
    titulo: "Ticket médio subindo nas terças",
    descricao:
      "Combos de corte + tratamento cresceram 18%. Vale destacar o pacote no seu link de agendamento.",
  },
  {
    tom: "info",
    titulo: "12 clientes sem retorno há 45 dias",
    descricao: "Boa hora para uma campanha de retorno com desconto progressivo.",
  },
];

export const profissionais: ProfissionalView[] = [
  {
    nome: "Rafael Souza",
    especialidade: "Cortes & Barba",
    atendimentos: 14,
    faturamento: 1120,
    ocupacao: 88,
  },
  {
    nome: "Camila Prado",
    especialidade: "Coloração",
    atendimentos: 9,
    faturamento: 1640,
    ocupacao: 74,
  },
  {
    nome: "Diego Martins",
    especialidade: "Barbearia",
    atendimentos: 11,
    faturamento: 720,
    ocupacao: 69,
  },
];

export function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });
}
