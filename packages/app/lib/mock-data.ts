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

export const resumoDia = {
  variacao: 8, // % vs. mesmo dia da semana passada
  novosClientes: 3,
  proximo: { hora: "11:15", cliente: "João Pedro" },
  // ordem visual do detalhamento por status
  porStatus: [
    { status: "confirmado" as StatusAgendamento, total: 12 },
    { status: "aguardando" as StatusAgendamento, total: 5 },
    { status: "em_atendimento" as StatusAgendamento, total: 1 },
    { status: "concluido" as StatusAgendamento, total: 6 },
  ],
};

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

// ─────────────────────────────────────────────
// Financeiro
// ─────────────────────────────────────────────

export interface MesFinanceiro {
  mes: string; // rótulo curto (Jan, Fev…)
  receita: number;
  despesa: number;
  atendimentos: number;
}

export interface FormaPagamento {
  nome: string;
  valor: number;
  cor: string; // classe tailwind de fundo p/ a legenda
}

export interface ReceitaCategoria {
  nome: string;
  valor: number;
  atendimentos: number;
}

export interface Transacao {
  data: string; // ISO (YYYY-MM-DD)
  cliente: string;
  servico: string;
  profissional: string;
  forma: "Pix" | "Crédito" | "Débito" | "Dinheiro";
  valor: number;
}

// Série dos últimos 12 meses (mais recente por último)
export const financeiroMensal: MesFinanceiro[] = [
  { mes: "Ago", receita: 38200, despesa: 21400, atendimentos: 312 },
  { mes: "Set", receita: 41500, despesa: 22100, atendimentos: 338 },
  { mes: "Out", receita: 39800, despesa: 22800, atendimentos: 325 },
  { mes: "Nov", receita: 44300, despesa: 23600, atendimentos: 361 },
  { mes: "Dez", receita: 52700, despesa: 26900, atendimentos: 418 },
  { mes: "Jan", receita: 47100, despesa: 24300, atendimentos: 372 },
  { mes: "Fev", receita: 45900, despesa: 23900, atendimentos: 358 },
  { mes: "Mar", receita: 49600, despesa: 25100, atendimentos: 389 },
  { mes: "Abr", receita: 51200, despesa: 25800, atendimentos: 401 },
  { mes: "Mai", receita: 54800, despesa: 26400, atendimentos: 427 },
  { mes: "Jun", receita: 57300, despesa: 27200, atendimentos: 446 },
  { mes: "Jul", receita: 61400, despesa: 28100, atendimentos: 468 },
];

export const formasPagamento: FormaPagamento[] = [
  { nome: "Pix", valor: 27600, cor: "bg-primary" },
  { nome: "Crédito", valor: 18900, cor: "bg-accent" },
  { nome: "Débito", valor: 9800, cor: "bg-success" },
  { nome: "Dinheiro", valor: 5100, cor: "bg-ink/30" },
];

export const receitaPorCategoria: ReceitaCategoria[] = [
  { nome: "Coloração & Mechas", valor: 22400, atendimentos: 148 },
  { nome: "Cortes", valor: 15600, atendimentos: 214 },
  { nome: "Tratamentos", valor: 11800, atendimentos: 132 },
  { nome: "Escova & Penteados", valor: 7900, atendimentos: 118 },
  { nome: "Barbearia", valor: 3700, atendimentos: 96 },
];

export const ultimasTransacoes: Transacao[] = [
  { data: "2026-07-18", cliente: "Marina Alves", servico: "Corte + Escova", profissional: "Rafael", forma: "Pix", valor: 180 },
  { data: "2026-07-18", cliente: "Beatriz Nunes", servico: "Coloração", profissional: "Camila", forma: "Crédito", valor: 320 },
  { data: "2026-07-17", cliente: "João Pedro", servico: "Barba + Corte", profissional: "Diego", forma: "Dinheiro", valor: 95 },
  { data: "2026-07-17", cliente: "Larissa Gomes", servico: "Hidratação", profissional: "Rafael", forma: "Pix", valor: 140 },
  { data: "2026-07-16", cliente: "Fernanda Lima", servico: "Mechas", profissional: "Camila", forma: "Crédito", valor: 410 },
  { data: "2026-07-16", cliente: "Paulo Reis", servico: "Corte", profissional: "Diego", forma: "Débito", valor: 70 },
  { data: "2026-07-15", cliente: "Aline Costa", servico: "Escova", profissional: "Rafael", forma: "Pix", valor: 90 },
];

// Métricas-resumo do mês corrente (derivadas do último ponto da série)
export const resumoFinanceiro = (() => {
  const atual = financeiroMensal[financeiroMensal.length - 1];
  const anterior = financeiroMensal[financeiroMensal.length - 2];
  const lucro = atual.receita - atual.despesa;
  const ticketMedio = atual.receita / atual.atendimentos;
  const ticketAnterior = anterior.receita / anterior.atendimentos;
  const variacao = (a: number, b: number) =>
    Math.round(((a - b) / b) * 1000) / 10;
  return {
    receita: atual.receita,
    despesa: atual.despesa,
    lucro,
    margem: Math.round((lucro / atual.receita) * 100),
    ticketMedio,
    atendimentos: atual.atendimentos,
    variacaoReceita: variacao(atual.receita, anterior.receita),
    variacaoDespesa: variacao(atual.despesa, anterior.despesa),
    variacaoLucro: variacao(lucro, anterior.receita - anterior.despesa),
    variacaoTicket: variacao(ticketMedio, ticketAnterior),
    variacaoAtendimentos: variacao(atual.atendimentos, anterior.atendimentos),
  };
})();

export function formatBRLCents(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

// ─────────────────────────────────────────────
// Clientes
// ─────────────────────────────────────────────

export type StatusCliente = "ativo" | "novo" | "inativo" | "vip";

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  status: StatusCliente;
  dataCadastro: string; // ISO
  ultimaVisita: string; // ISO
  totalVisitas: number;
  totalGasto: number;
  servicoFavorito: string;
  profissionalPreferido: string;
  aniversario: string; // MM-DD
}

export const clientes: Cliente[] = [
  {
    id: "c1",
    nome: "Marina Alves",
    email: "marina.alves@email.com",
    telefone: "(11) 98812-4471",
    status: "vip",
    dataCadastro: "2023-02-14",
    ultimaVisita: "2026-07-18",
    totalVisitas: 42,
    totalGasto: 7480,
    servicoFavorito: "Coloração",
    profissionalPreferido: "Camila Prado",
    aniversario: "03-11",
  },
  {
    id: "c2",
    nome: "Beatriz Nunes",
    email: "bia.nunes@email.com",
    telefone: "(11) 99145-2093",
    status: "ativo",
    dataCadastro: "2024-06-03",
    ultimaVisita: "2026-07-18",
    totalVisitas: 18,
    totalGasto: 3260,
    servicoFavorito: "Mechas",
    profissionalPreferido: "Camila Prado",
    aniversario: "09-27",
  },
  {
    id: "c3",
    nome: "João Pedro Martins",
    email: "jp.martins@email.com",
    telefone: "(11) 98023-7788",
    status: "ativo",
    dataCadastro: "2024-01-20",
    ultimaVisita: "2026-07-17",
    totalVisitas: 26,
    totalGasto: 2140,
    servicoFavorito: "Barba + Corte",
    profissionalPreferido: "Diego Martins",
    aniversario: "12-04",
  },
  {
    id: "c4",
    nome: "Larissa Gomes",
    email: "larissa.gomes@email.com",
    telefone: "(11) 99678-1120",
    status: "ativo",
    dataCadastro: "2023-11-08",
    ultimaVisita: "2026-07-17",
    totalVisitas: 31,
    totalGasto: 4390,
    servicoFavorito: "Hidratação",
    profissionalPreferido: "Rafael Souza",
    aniversario: "05-19",
  },
  {
    id: "c5",
    nome: "Fernanda Lima",
    email: "fe.lima@email.com",
    telefone: "(11) 98456-3301",
    status: "vip",
    dataCadastro: "2022-09-12",
    ultimaVisita: "2026-07-16",
    totalVisitas: 58,
    totalGasto: 9820,
    servicoFavorito: "Mechas",
    profissionalPreferido: "Camila Prado",
    aniversario: "01-30",
  },
  {
    id: "c6",
    nome: "Paulo Reis",
    email: "paulo.reis@email.com",
    telefone: "(11) 99012-5567",
    status: "ativo",
    dataCadastro: "2025-03-22",
    ultimaVisita: "2026-07-16",
    totalVisitas: 9,
    totalGasto: 630,
    servicoFavorito: "Corte",
    profissionalPreferido: "Diego Martins",
    aniversario: "08-15",
  },
  {
    id: "c7",
    nome: "Aline Costa",
    email: "aline.costa@email.com",
    telefone: "(11) 98790-4432",
    status: "novo",
    dataCadastro: "2026-07-05",
    ultimaVisita: "2026-07-15",
    totalVisitas: 2,
    totalGasto: 180,
    servicoFavorito: "Escova",
    profissionalPreferido: "Rafael Souza",
    aniversario: "11-02",
  },
  {
    id: "c8",
    nome: "Rodrigo Teixeira",
    email: "rodrigo.tex@email.com",
    telefone: "(11) 99334-8890",
    status: "novo",
    dataCadastro: "2026-07-10",
    ultimaVisita: "2026-07-12",
    totalVisitas: 1,
    totalGasto: 95,
    servicoFavorito: "Barba",
    profissionalPreferido: "Diego Martins",
    aniversario: "04-22",
  },
  {
    id: "c9",
    nome: "Camila Ferraz",
    email: "camila.ferraz@email.com",
    telefone: "(11) 98167-2245",
    status: "inativo",
    dataCadastro: "2023-05-30",
    ultimaVisita: "2026-02-08",
    totalVisitas: 14,
    totalGasto: 1980,
    servicoFavorito: "Coloração",
    profissionalPreferido: "Camila Prado",
    aniversario: "07-14",
  },
  {
    id: "c10",
    nome: "Thiago Barros",
    email: "thiago.barros@email.com",
    telefone: "(11) 99521-6678",
    status: "inativo",
    dataCadastro: "2022-12-01",
    ultimaVisita: "2026-01-19",
    totalVisitas: 22,
    totalGasto: 1710,
    servicoFavorito: "Corte + Barba",
    profissionalPreferido: "Diego Martins",
    aniversario: "10-09",
  },
  {
    id: "c11",
    nome: "Juliana Prado",
    email: "ju.prado@email.com",
    telefone: "(11) 98890-1123",
    status: "ativo",
    dataCadastro: "2024-08-17",
    ultimaVisita: "2026-07-14",
    totalVisitas: 20,
    totalGasto: 3540,
    servicoFavorito: "Escova + Coloração",
    profissionalPreferido: "Camila Prado",
    aniversario: "02-25",
  },
  {
    id: "c12",
    nome: "Gustavo Almeida",
    email: "gustavo.almeida@email.com",
    telefone: "(11) 99745-3390",
    status: "ativo",
    dataCadastro: "2025-01-09",
    ultimaVisita: "2026-07-11",
    totalVisitas: 12,
    totalGasto: 1080,
    servicoFavorito: "Corte",
    profissionalPreferido: "Rafael Souza",
    aniversario: "06-08",
  },
];

// ─────────────────────────────────────────────
// Agenda do dia
// ─────────────────────────────────────────────

export interface AgendamentoAgenda {
  id: string;
  inicio: string; // "HH:MM"
  duracao: number; // minutos
  cliente: string;
  servico: string;
  profissional: string;
  status: StatusAgendamento;
  valor: number;
}

export const agendaDoDia: AgendamentoAgenda[] = [
  { id: "a1", inicio: "09:00", duracao: 60, cliente: "Marina Alves", servico: "Corte + Escova", profissional: "Rafael Souza", status: "concluido", valor: 180 },
  { id: "a2", inicio: "09:30", duracao: 120, cliente: "Beatriz Nunes", servico: "Coloração", profissional: "Camila Prado", status: "em_atendimento", valor: 320 },
  { id: "a3", inicio: "10:15", duracao: 45, cliente: "Paulo Reis", servico: "Corte", profissional: "Diego Martins", status: "concluido", valor: 70 },
  { id: "a4", inicio: "11:15", duracao: 40, cliente: "João Pedro Martins", servico: "Barba + Corte", profissional: "Diego Martins", status: "confirmado", valor: 95 },
  { id: "a5", inicio: "11:30", duracao: 50, cliente: "Aline Costa", servico: "Escova", profissional: "Rafael Souza", status: "confirmado", valor: 90 },
  { id: "a6", inicio: "13:00", duracao: 60, cliente: "Larissa Gomes", servico: "Hidratação", profissional: "Rafael Souza", status: "aguardando", valor: 140 },
  { id: "a7", inicio: "13:30", duracao: 150, cliente: "Fernanda Lima", servico: "Mechas", profissional: "Camila Prado", status: "confirmado", valor: 410 },
  { id: "a8", inicio: "14:30", duracao: 45, cliente: "Gustavo Almeida", servico: "Corte", profissional: "Diego Martins", status: "confirmado", valor: 75 },
  { id: "a9", inicio: "15:30", duracao: 90, cliente: "Juliana Prado", servico: "Escova + Coloração", profissional: "Camila Prado", status: "aguardando", valor: 280 },
  { id: "a10", inicio: "16:00", duracao: 40, cliente: "Rodrigo Teixeira", servico: "Barba", profissional: "Diego Martins", status: "confirmado", valor: 60 },
  { id: "a11", inicio: "16:30", duracao: 60, cliente: "Thiago Barros", servico: "Corte + Barba", profissional: "Rafael Souza", status: "confirmado", valor: 120 },
];

export const statusAgendamentoMeta: Record<
  StatusAgendamento,
  { label: string; tone: "primary" | "accent" | "success" | "neutral"; dot: string }
> = {
  confirmado: { label: "Confirmado", tone: "primary", dot: "bg-primary" },
  aguardando: { label: "Aguardando", tone: "neutral", dot: "bg-ink/40" },
  em_atendimento: { label: "Em atendimento", tone: "accent", dot: "bg-accent" },
  concluido: { label: "Concluído", tone: "success", dot: "bg-success" },
};

// Calcula "HH:MM" de término a partir do início + duração
export function horaFim(inicio: string, duracao: number): string {
  const [h, m] = inicio.split(":").map(Number);
  const total = h * 60 + m + duracao;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

// Resumo do dia derivado de uma lista de agendamentos
export function calcResumoAgenda(lista: AgendamentoAgenda[]) {
  const confirmados = lista.filter(
    (a) => a.status === "confirmado" || a.status === "em_atendimento",
  ).length;
  const concluidos = lista.filter((a) => a.status === "concluido").length;
  const faturamentoPrevisto = lista.reduce((s, a) => s + a.valor, 0);
  const minutosOcupados = lista.reduce((s, a) => s + a.duracao, 0);
  // jornada útil: 3 profissionais × 8h
  const capacidadeMin = 3 * 8 * 60;
  return {
    total: lista.length,
    confirmados,
    concluidos,
    faturamentoPrevisto,
    ocupacao: Math.round((minutosOcupados / capacidadeMin) * 100),
  };
}

export const resumoAgenda = calcResumoAgenda(agendaDoDia);

// Métricas-resumo derivadas de uma lista de clientes
export function calcResumoClientes(lista: Cliente[]) {
  const hoje = new Date("2026-07-18T00:00:00");
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const novosMes = lista.filter(
    (c) => new Date(c.dataCadastro + "T00:00:00") >= inicioMes,
  ).length;
  const ativos = lista.filter((c) => c.status !== "inativo").length;
  const gastoTotal = lista.reduce((s, c) => s + c.totalGasto, 0);
  const visitasTotais = lista.reduce((s, c) => s + c.totalVisitas, 0);
  return {
    total: lista.length,
    novosMes,
    ativos,
    taxaRetorno: lista.length ? Math.round((ativos / lista.length) * 100) : 0,
    ticketMedio: visitasTotais ? Math.round(gastoTotal / visitasTotais) : 0,
  };
}

export const resumoClientes = calcResumoClientes(clientes);

// ─────────────────────────────────────────────
// WhatsApp
// ─────────────────────────────────────────────

export interface MensagemWA {
  de: "cliente" | "salao";
  texto: string;
  hora: string; // "HH:MM"
  lida?: boolean;
}

export interface ConversaWA {
  id: string;
  nome: string;
  telefone: string;
  hora: string; // horário da última mensagem
  naoLidas: number;
  online: boolean;
  mensagens: MensagemWA[];
}

export const conversasWhatsApp: ConversaWA[] = [
  {
    id: "w1",
    nome: "Marina Alves",
    telefone: "(11) 98812-4471",
    hora: "10:42",
    naoLidas: 2,
    online: true,
    mensagens: [
      { de: "cliente", texto: "Oi! Consigo remarcar meu horário de amanhã?", hora: "10:38" },
      { de: "salao", texto: "Oi Marina! Claro 😊 Para qual dia você prefere?", hora: "10:40", lida: true },
      { de: "cliente", texto: "Pode ser quinta às 15h?", hora: "10:41" },
      { de: "cliente", texto: "Com a Camila, se possível 💜", hora: "10:42" },
    ],
  },
  {
    id: "w2",
    nome: "João Pedro",
    telefone: "(11) 98023-7788",
    hora: "09:15",
    naoLidas: 0,
    online: false,
    mensagens: [
      { de: "cliente", texto: "Bom dia, vocês abrem no sábado?", hora: "09:10" },
      { de: "salao", texto: "Bom dia! Sim, das 9h às 18h.", hora: "09:12", lida: true },
      { de: "cliente", texto: "Perfeito, obrigado!", hora: "09:15" },
    ],
  },
  {
    id: "w3",
    nome: "Beatriz Nunes",
    telefone: "(11) 99145-2093",
    hora: "Ontem",
    naoLidas: 1,
    online: false,
    mensagens: [
      { de: "salao", texto: "Oi Bia! Passando pra confirmar seu horário de coloração amanhã às 10h30. Confirma? 💇‍♀️", hora: "18:20", lida: true },
      { de: "cliente", texto: "Confirmado! Até amanhã 🥰", hora: "18:45" },
    ],
  },
  {
    id: "w4",
    nome: "Fernanda Lima",
    telefone: "(11) 98456-3301",
    hora: "Ontem",
    naoLidas: 0,
    online: false,
    mensagens: [
      { de: "cliente", texto: "Quanto fica mechas + hidratação?", hora: "16:02" },
      { de: "salao", texto: "Oi Fernanda! O combo sai por R$ 410. Quer que eu já reserve um horário?", hora: "16:10", lida: true },
      { de: "cliente", texto: "Quero sim! Sexta de tarde tem?", hora: "16:15" },
      { de: "salao", texto: "Tenho às 13h30 com a Camila 👍", hora: "16:18", lida: true },
    ],
  },
  {
    id: "w5",
    nome: "Rodrigo Teixeira",
    telefone: "(11) 99334-8890",
    hora: "Seg",
    naoLidas: 0,
    online: false,
    mensagens: [
      { de: "cliente", texto: "Fazem a barba desenhada?", hora: "14:30" },
      { de: "salao", texto: "Fazemos sim! O Diego é especialista nisso 💈", hora: "14:35", lida: true },
    ],
  },
  {
    id: "w6",
    nome: "Larissa Gomes",
    telefone: "(11) 99678-1120",
    hora: "Seg",
    naoLidas: 3,
    online: true,
    mensagens: [
      { de: "cliente", texto: "Oii, tudo bem?", hora: "11:00" },
      { de: "cliente", texto: "Queria agendar uma hidratação essa semana", hora: "11:01" },
      { de: "cliente", texto: "Tem horário na quarta?", hora: "11:02" },
    ],
  },
];

// ─────────────────────────────────────────────
// Insights de IA
// ─────────────────────────────────────────────

export type AreaInsight =
  | "clientes"
  | "servicos"
  | "profissionais"
  | "unidades";

export type TomInsight = "oportunidade" | "risco" | "tendencia";

export interface Insight {
  id: string;
  area: AreaInsight;
  tom: TomInsight;
  titulo: string;
  descricao: string;
  // impacto financeiro estimado (R$/mês); 0 quando não aplicável
  impacto: number;
  confianca: number; // 0–100
  acao: string;
}

export const insightsIA: Insight[] = [
  // Clientes
  {
    id: "i1",
    area: "clientes",
    tom: "risco",
    titulo: "23 clientes em risco de abandono",
    descricao:
      "Clientes que vinham a cada 30 dias estão há mais de 60 sem retornar. O padrão começou depois do reajuste de preços em maio.",
    impacto: 4800,
    confianca: 87,
    acao: "Disparar campanha de retorno com desconto progressivo",
  },
  {
    id: "i2",
    area: "clientes",
    tom: "oportunidade",
    titulo: "Clientes VIP concentram 38% da receita",
    descricao:
      "Apenas 12% da base gera mais de um terço do faturamento. Um programa de fidelidade pode aumentar a frequência desse grupo.",
    impacto: 3200,
    confianca: 92,
    acao: "Criar programa de fidelidade para o grupo VIP",
  },
  {
    id: "i3",
    area: "clientes",
    tom: "tendencia",
    titulo: "Novos clientes crescem 25% ao mês",
    descricao:
      "A maior parte vem do agendamento online. O horário de pico de cadastro é entre 19h e 22h.",
    impacto: 0,
    confianca: 78,
    acao: "Reforçar divulgação do link nesse horário",
  },

  // Serviços
  {
    id: "i4",
    area: "servicos",
    tom: "oportunidade",
    titulo: "Combo Corte + Hidratação tem alta conversão",
    descricao:
      "Clientes que fazem corte aceitam hidratação em 34% das vezes quando ofertada. Hoje a oferta não é sistemática.",
    impacto: 5600,
    confianca: 84,
    acao: "Criar combo com preço promocional no catálogo",
  },
  {
    id: "i5",
    area: "servicos",
    tom: "risco",
    titulo: "Progressiva com margem apertada",
    descricao:
      "Leva 180 min e paga 45% de comissão. A receita por hora é 40% menor que a da coloração.",
    impacto: 1900,
    confianca: 81,
    acao: "Revisar preço ou reduzir tempo de execução",
  },
  {
    id: "i6",
    area: "servicos",
    tom: "tendencia",
    titulo: "Serviços de unhas crescendo",
    descricao:
      "Manicure e esmaltação em gel subiram 22% no trimestre, mas só há uma profissional na área.",
    impacto: 2400,
    confianca: 76,
    acao: "Avaliar contratação para o setor de unhas",
  },

  // Profissionais
  {
    id: "i7",
    area: "profissionais",
    tom: "risco",
    titulo: "Camila está com 92% de ocupação",
    descricao:
      "Acima de 90% o risco de atraso e cancelamento cresce muito. Ela já concentra 40% da receita da unidade.",
    impacto: 2800,
    confianca: 89,
    acao: "Redistribuir agenda ou abrir horários com outro profissional",
  },
  {
    id: "i8",
    area: "profissionais",
    tom: "oportunidade",
    titulo: "Bruno tem 34% da agenda ociosa",
    descricao:
      "Entrou em fevereiro e ainda não atingiu a ocupação média da equipe. Tem boa avaliação (4.6).",
    impacto: 3600,
    confianca: 83,
    acao: "Direcionar novos clientes de corte para ele",
  },
  {
    id: "i9",
    area: "profissionais",
    tom: "tendencia",
    titulo: "Avaliação da equipe subiu para 4.8",
    descricao:
      "Melhora consistente nos últimos 3 meses, puxada pelos serviços de coloração.",
    impacto: 0,
    confianca: 72,
    acao: "Usar as avaliações como prova social no agendamento",
  },

  // Unidades
  {
    id: "i10",
    area: "unidades",
    tom: "risco",
    titulo: "Studio Praia sem faturamento hoje",
    descricao:
      "A unidade está inativa e com ocupação de 52% no mês. O custo fixo segue correndo.",
    impacto: 6800,
    confianca: 95,
    acao: "Revisar operação ou reativar a agenda da unidade",
  },
  {
    id: "i11",
    area: "unidades",
    tom: "oportunidade",
    titulo: "Studio Vila com capacidade sobrando",
    descricao:
      "71% de ocupação com 6 cadeiras. Comporta mais 2 profissionais sem obra ou custo de estrutura.",
    impacto: 7400,
    confianca: 80,
    acao: "Contratar para a unidade Vila antes de abrir nova",
  },
  {
    id: "i12",
    area: "unidades",
    tom: "tendencia",
    titulo: "Centro responde por 62% da receita",
    descricao:
      "A matriz cresce 13% ao mês, ritmo maior que as demais unidades somadas.",
    impacto: 0,
    confianca: 88,
    acao: "Replicar as práticas do Centro nas outras unidades",
  },
];

export const areaInsightMeta: Record<
  AreaInsight,
  { label: string; plural: string }
> = {
  clientes: { label: "Clientes", plural: "clientes" },
  servicos: { label: "Serviços", plural: "serviços" },
  profissionais: { label: "Profissionais", plural: "profissionais" },
  unidades: { label: "Unidades", plural: "unidades" },
};

export const resumoIA = (() => {
  const oportunidades = insightsIA.filter((i) => i.tom === "oportunidade");
  const riscos = insightsIA.filter((i) => i.tom === "risco");
  return {
    total: insightsIA.length,
    oportunidades: oportunidades.length,
    riscos: riscos.length,
    impactoPotencial: oportunidades.reduce((s, i) => s + i.impacto, 0),
    receitaEmRisco: riscos.reduce((s, i) => s + i.impacto, 0),
    confiancaMedia: Math.round(
      insightsIA.reduce((s, i) => s + i.confianca, 0) / insightsIA.length,
    ),
  };
})();

// ─────────────────────────────────────────────
// Planos de assinatura
// ─────────────────────────────────────────────

export interface Plano {
  id: "essencial" | "profissional" | "premium";
  nome: string;
  descricao: string;
  precoMensal: number;
  precoAnual: number; // valor por mês quando cobrado anualmente
  destaque: boolean;
  unidades: string;
  profissionais: string;
  recursos: string[];
}

export const planos: Plano[] = [
  {
    id: "essencial",
    nome: "Essencial",
    descricao: "Para quem está começando a organizar a agenda.",
    precoMensal: 99,
    precoAnual: 79,
    destaque: false,
    unidades: "1 unidade",
    profissionais: "Até 3 profissionais",
    recursos: [
      "Agenda e agendamento online",
      "Cadastro de clientes",
      "Catálogo de serviços",
      "Relatórios básicos",
      "Suporte por e-mail",
    ],
  },
  {
    id: "profissional",
    nome: "Profissional",
    descricao: "Para salões que querem crescer com automação.",
    precoMensal: 249,
    precoAnual: 199,
    destaque: true,
    unidades: "Até 3 unidades",
    profissionais: "Até 15 profissionais",
    recursos: [
      "Tudo do Essencial",
      "WhatsApp integrado",
      "Lembretes e confirmações automáticas",
      "Relatórios financeiros completos",
      "Alertas de IA",
      "Suporte prioritário",
    ],
  },
  {
    id: "premium",
    nome: "Premium",
    descricao: "Para redes com várias unidades e operação complexa.",
    precoMensal: 499,
    precoAnual: 399,
    destaque: false,
    unidades: "Unidades ilimitadas",
    profissionais: "Profissionais ilimitados",
    recursos: [
      "Tudo do Profissional",
      "API pública e webhooks",
      "Automações avançadas (n8n)",
      "Gerente de conta dedicado",
      "Onboarding assistido",
      "SLA de suporte 24/7",
    ],
  },
];

export const planoAtualId: Plano["id"] = "profissional";

// ─────────────────────────────────────────────
// Equipe (profissionais)
// ─────────────────────────────────────────────

export type StatusProfissional = "ativo" | "ferias" | "inativo";

export interface ProfissionalCompleto {
  id: string;
  nome: string;
  especialidade: string;
  email: string;
  telefone: string;
  status: StatusProfissional;
  desde: string; // ISO
  atendimentosMes: number;
  faturamentoMes: number;
  ocupacao: number;
  comissao: number; // %
  avaliacao: number; // 0–5
  servicos: string[];
  dias: string[];
  horario: string;
  unidade: string;
}

export const equipe: ProfissionalCompleto[] = [
  {
    id: "p1",
    nome: "Rafael Souza",
    especialidade: "Cortes & Barba",
    email: "rafael.souza@salonai.com",
    telefone: "(11) 98123-4455",
    status: "ativo",
    desde: "2022-03-14",
    atendimentosMes: 148,
    faturamentoMes: 15600,
    ocupacao: 88,
    comissao: 40,
    avaliacao: 4.9,
    servicos: ["Corte", "Barba", "Escova", "Hidratação"],
    dias: ["Seg", "Ter", "Qua", "Qui", "Sex"],
    horario: "09:00 – 18:00",
    unidade: "Studio Centro",
  },
  {
    id: "p2",
    nome: "Camila Prado",
    especialidade: "Coloração & Mechas",
    email: "camila.prado@salonai.com",
    telefone: "(11) 99234-8877",
    status: "ativo",
    desde: "2021-08-02",
    atendimentosMes: 132,
    faturamentoMes: 22400,
    ocupacao: 92,
    comissao: 45,
    avaliacao: 5.0,
    servicos: ["Coloração", "Mechas", "Escova", "Tratamentos"],
    dias: ["Ter", "Qua", "Qui", "Sex", "Sáb"],
    horario: "10:00 – 19:00",
    unidade: "Studio Centro",
  },
  {
    id: "p3",
    nome: "Diego Martins",
    especialidade: "Barbearia",
    email: "diego.martins@salonai.com",
    telefone: "(11) 98567-1290",
    status: "ativo",
    desde: "2023-01-19",
    atendimentosMes: 166,
    faturamentoMes: 11200,
    ocupacao: 79,
    comissao: 38,
    avaliacao: 4.7,
    servicos: ["Corte", "Barba", "Barba desenhada", "Pigmentação"],
    dias: ["Seg", "Ter", "Qui", "Sex", "Sáb"],
    horario: "09:00 – 18:00",
    unidade: "Studio Vila",
  },
  {
    id: "p4",
    nome: "Patrícia Ramos",
    especialidade: "Manicure & Pedicure",
    email: "patricia.ramos@salonai.com",
    telefone: "(11) 99456-3321",
    status: "ferias",
    desde: "2023-06-05",
    atendimentosMes: 74,
    faturamentoMes: 4980,
    ocupacao: 54,
    comissao: 35,
    avaliacao: 4.8,
    servicos: ["Manicure", "Pedicure", "Esmaltação em gel"],
    dias: ["Qua", "Qui", "Sex", "Sáb"],
    horario: "10:00 – 17:00",
    unidade: "Studio Vila",
  },
  {
    id: "p5",
    nome: "Bruno Carvalho",
    especialidade: "Cortes masculinos",
    email: "bruno.carvalho@salonai.com",
    telefone: "(11) 98890-7712",
    status: "ativo",
    desde: "2025-02-10",
    atendimentosMes: 98,
    faturamentoMes: 7300,
    ocupacao: 66,
    comissao: 35,
    avaliacao: 4.6,
    servicos: ["Corte", "Barba"],
    dias: ["Seg", "Qua", "Qui", "Sex"],
    horario: "12:00 – 20:00",
    unidade: "Studio Praia",
  },
];

export function calcResumoEquipe(lista: ProfissionalCompleto[]) {
  const n = lista.length || 1;
  return {
    total: lista.length,
    ativos: lista.filter((p) => p.status === "ativo").length,
    faturamento: lista.reduce((s, p) => s + p.faturamentoMes, 0),
    atendimentos: lista.reduce((s, p) => s + p.atendimentosMes, 0),
    ocupacaoMedia: Math.round(lista.reduce((s, p) => s + p.ocupacao, 0) / n),
    avaliacaoMedia:
      Math.round((lista.reduce((s, p) => s + p.avaliacao, 0) / n) * 10) / 10,
  };
}

export const resumoEquipe = calcResumoEquipe(equipe);

// ─────────────────────────────────────────────
// Serviços
// ─────────────────────────────────────────────

export interface Servico {
  id: string;
  nome: string;
  categoria: string;
  duracao: number; // minutos
  preco: number;
  comissao: number; // %
  realizadosMes: number;
  ativo: boolean;
}

export const servicos: Servico[] = [
  { id: "s1", nome: "Corte feminino", categoria: "Cortes", duracao: 45, preco: 90, comissao: 40, realizadosMes: 118, ativo: true },
  { id: "s2", nome: "Corte masculino", categoria: "Cortes", duracao: 30, preco: 70, comissao: 40, realizadosMes: 96, ativo: true },
  { id: "s3", nome: "Barba", categoria: "Barbearia", duracao: 30, preco: 55, comissao: 38, realizadosMes: 64, ativo: true },
  { id: "s4", nome: "Barba desenhada", categoria: "Barbearia", duracao: 45, preco: 75, comissao: 38, realizadosMes: 32, ativo: true },
  { id: "s5", nome: "Coloração", categoria: "Coloração", duracao: 120, preco: 320, comissao: 45, realizadosMes: 84, ativo: true },
  { id: "s6", nome: "Mechas / Luzes", categoria: "Coloração", duracao: 150, preco: 410, comissao: 45, realizadosMes: 64, ativo: true },
  { id: "s7", nome: "Escova", categoria: "Escova & Penteados", duracao: 45, preco: 90, comissao: 35, realizadosMes: 88, ativo: true },
  { id: "s8", nome: "Penteado para festa", categoria: "Escova & Penteados", duracao: 90, preco: 220, comissao: 40, realizadosMes: 30, ativo: true },
  { id: "s9", nome: "Hidratação", categoria: "Tratamentos", duracao: 60, preco: 140, comissao: 35, realizadosMes: 76, ativo: true },
  { id: "s10", nome: "Botox capilar", categoria: "Tratamentos", duracao: 90, preco: 260, comissao: 40, realizadosMes: 38, ativo: true },
  { id: "s11", nome: "Progressiva", categoria: "Tratamentos", duracao: 180, preco: 450, comissao: 45, realizadosMes: 18, ativo: true },
  { id: "s12", nome: "Manicure", categoria: "Unhas", duracao: 40, preco: 55, comissao: 35, realizadosMes: 92, ativo: true },
  { id: "s13", nome: "Pedicure", categoria: "Unhas", duracao: 50, preco: 65, comissao: 35, realizadosMes: 58, ativo: true },
  { id: "s14", nome: "Esmaltação em gel", categoria: "Unhas", duracao: 60, preco: 95, comissao: 35, realizadosMes: 44, ativo: true },
  { id: "s15", nome: "Pigmentação de barba", categoria: "Barbearia", duracao: 40, preco: 85, comissao: 38, realizadosMes: 12, ativo: false },
];

export function calcResumoServicos(lista: Servico[]) {
  const receita = lista.reduce((s, sv) => s + sv.preco * sv.realizadosMes, 0);
  const realizados = lista.reduce((s, sv) => s + sv.realizadosMes, 0);
  const maisVendido =
    [...lista].sort((a, b) => b.realizadosMes - a.realizadosMes)[0] ?? lista[0];
  return {
    total: lista.length,
    ativos: lista.filter((s) => s.ativo).length,
    categorias: new Set(lista.map((s) => s.categoria)).size,
    receita,
    ticketMedio: realizados ? Math.round(receita / realizados) : 0,
    maisVendido,
  };
}

export const resumoServicos = calcResumoServicos(servicos);

// ─────────────────────────────────────────────
// Unidades
// ─────────────────────────────────────────────

export interface Unidade {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  telefone: string;
  horario: string;
  profissionais: number;
  cadeiras: number;
  faturamentoMes: number;
  faturamentoDia: number;
  atendimentosDia: number;
  atendimentosMes: number;
  ocupacao: number;
  ativa: boolean;
  principal: boolean;
}

export const unidades: Unidade[] = [
  {
    id: "u1",
    nome: "Studio Centro",
    endereco: "Rua Augusta, 1420 — Consolação",
    cidade: "São Paulo / SP",
    telefone: "(11) 3255-8890",
    horario: "Seg a Sáb · 09:00 – 19:00",
    profissionais: 6,
    cadeiras: 9,
    faturamentoMes: 38200,
    faturamentoDia: 1840,
    atendimentosDia: 11,
    atendimentosMes: 280,
    ocupacao: 88,
    ativa: true,
    principal: true,
  },
  {
    id: "u2",
    nome: "Studio Vila",
    endereco: "Av. Brigadeiro Faria Lima, 780 — Pinheiros",
    cidade: "São Paulo / SP",
    telefone: "(11) 3644-2210",
    horario: "Seg a Sáb · 10:00 – 20:00",
    profissionais: 4,
    cadeiras: 6,
    faturamentoMes: 16400,
    faturamentoDia: 920,
    atendimentosDia: 6,
    atendimentosMes: 142,
    ocupacao: 71,
    ativa: true,
    principal: false,
  },
  {
    id: "u3",
    nome: "Studio Praia",
    endereco: "Av. Beira Mar, 305 — Centro",
    cidade: "Santos / SP",
    telefone: "(13) 3122-7745",
    horario: "Ter a Dom · 10:00 – 19:00",
    profissionais: 3,
    cadeiras: 5,
    faturamentoMes: 6800,
    faturamentoDia: 0,
    atendimentosDia: 0,
    atendimentosMes: 46,
    ocupacao: 52,
    ativa: false,
    principal: false,
  },
];

// ─────────────────────────────────────────────
// Notificações do dia
// ─────────────────────────────────────────────

export type TipoNotificacao =
  | "agendamento"
  | "pagamento"
  | "mensagem"
  | "alerta";

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  descricao: string;
  hora: string;
  lida: boolean;
}

export const notificacoesHoje: Notificacao[] = [
  {
    id: "n1",
    tipo: "agendamento",
    titulo: "Novo agendamento",
    descricao: "Fernanda Lima marcou Mechas com Camila às 13h30.",
    hora: "10:42",
    lida: false,
  },
  {
    id: "n2",
    tipo: "mensagem",
    titulo: "3 mensagens não lidas",
    descricao: "Larissa Gomes quer agendar uma hidratação essa semana.",
    hora: "10:15",
    lida: false,
  },
  {
    id: "n3",
    tipo: "pagamento",
    titulo: "Pagamento recebido",
    descricao: "Beatriz Nunes pagou R$ 320 via crédito.",
    hora: "09:58",
    lida: false,
  },
  {
    id: "n4",
    tipo: "alerta",
    titulo: "Horários ociosos amanhã",
    descricao: "Camila tem 14h–17h livres. Vale disparar reativação.",
    hora: "09:30",
    lida: true,
  },
  {
    id: "n5",
    tipo: "agendamento",
    titulo: "Cancelamento",
    descricao: "Paulo Reis cancelou o corte das 16h.",
    hora: "08:47",
    lida: true,
  },
];

export function calcResumoUnidades(lista: Unidade[]) {
  const n = lista.length || 1;
  return {
    total: lista.length,
    ativas: lista.filter((u) => u.ativa).length,
    faturamento: lista.reduce((s, u) => s + u.faturamentoMes, 0),
    profissionais: lista.reduce((s, u) => s + u.profissionais, 0),
    ocupacaoMedia: Math.round(lista.reduce((s, u) => s + u.ocupacao, 0) / n),
  };
}

export const resumoUnidades = calcResumoUnidades(unidades);

export const resumoWhatsApp = (() => {
  const naoLidas = conversasWhatsApp.reduce((s, c) => s + c.naoLidas, 0);
  const comPendencia = conversasWhatsApp.filter((c) => c.naoLidas > 0).length;
  return {
    conversas: conversasWhatsApp.length,
    naoLidas,
    comPendencia,
    tempoMedioResposta: "3 min",
  };
})();
