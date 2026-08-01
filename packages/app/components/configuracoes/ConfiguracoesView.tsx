"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { AbaAssinatura } from "@/components/configuracoes/AbaAssinatura";
import {
  IconStore,
  IconClock,
  IconBell,
  IconSparkles,
  IconWallet,
  IconCheck,
  IconWhatsApp,
  IconMail,
  IconCalendar,
  IconLock,
  IconArrowRight,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

type Aba = "salao" | "horarios" | "notificacoes" | "integracoes" | "assinatura";

const abas: { chave: Aba; label: string; Icon: typeof IconStore }[] = [
  { chave: "salao", label: "Salão", Icon: IconStore },
  { chave: "horarios", label: "Horários", Icon: IconClock },
  { chave: "notificacoes", label: "Notificações", Icon: IconBell },
  { chave: "integracoes", label: "Integrações", Icon: IconSparkles },
  { chave: "assinatura", label: "Assinatura", Icon: IconWallet },
];

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

interface DiaHorario {
  aberto: boolean;
  abre: string;
  fecha: string;
}

const horariosIniciais: Record<string, DiaHorario> = {
  Segunda: { aberto: true, abre: "09:00", fecha: "19:00" },
  Terça: { aberto: true, abre: "09:00", fecha: "19:00" },
  Quarta: { aberto: true, abre: "09:00", fecha: "19:00" },
  Quinta: { aberto: true, abre: "09:00", fecha: "20:00" },
  Sexta: { aberto: true, abre: "09:00", fecha: "20:00" },
  Sábado: { aberto: true, abre: "09:00", fecha: "18:00" },
  Domingo: { aberto: false, abre: "10:00", fecha: "16:00" },
};

const notificacoesIniciais = [
  { id: "lembrete", titulo: "Lembrete de agendamento", descricao: "Envia lembrete ao cliente 24h antes do horário.", ativo: true },
  { id: "confirmacao", titulo: "Confirmação automática", descricao: "Pede confirmação por WhatsApp no dia anterior.", ativo: true },
  { id: "aniversario", titulo: "Mensagem de aniversário", descricao: "Parabeniza o cliente com um cupom de desconto.", ativo: true },
  { id: "retorno", titulo: "Campanha de retorno", descricao: "Avisa clientes sem visita há mais de 45 dias.", ativo: false },
  { id: "resumo", titulo: "Resumo diário", descricao: "Envia o fechamento do dia no seu WhatsApp às 20h.", ativo: true },
  { id: "alertas", titulo: "Alertas de IA", descricao: "Notifica sobre ociosidade, quedas de faturamento e oportunidades.", ativo: true },
];

const integracoes = [
  { id: "whatsapp", nome: "WhatsApp", descricao: "Conversas, lembretes e confirmações automáticas.", Icon: IconWhatsApp, conectado: false, href: "/whatsapp" },
  { id: "stripe", nome: "Stripe", descricao: "Cobrança da assinatura e pagamentos online.", Icon: IconWallet, conectado: true, href: "/configuracoes/assinatura" },
  { id: "calendar", nome: "Google Calendar", descricao: "Espelha a agenda do salão no seu calendário.", Icon: IconCalendar, conectado: false, href: null },
  { id: "email", nome: "E-mail transacional", descricao: "Envio de recibos e confirmações por e-mail.", Icon: IconMail, conectado: true, href: null },
];

export function ConfiguracoesView() {
  const [aba, setAba] = useState<Aba>("salao");
  const [salvo, setSalvo] = useState(false);

  const [salao, setSalao] = useState({
    nome: "Salon AI — Studio Centro",
    email: "contato@salonai.com",
    telefone: "(11) 3255-8890",
    cnpj: "12.345.678/0001-90",
    endereco: "Rua Augusta, 1420 — Consolação, São Paulo / SP",
    descricao:
      "Salão de beleza e barbearia com foco em coloração, cortes e tratamentos capilares.",
  });

  const [horarios, setHorarios] = useState(horariosIniciais);
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais);

  function salvar() {
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  }

  function setDia(dia: string, patch: Partial<DiaHorario>) {
    setHorarios((h) => ({ ...h, [dia]: { ...h[dia], ...patch } }));
  }

  const inputHora =
    "h-10 rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-40";

  return (
    <div className="mx-auto max-w-5xl animate-fade-up space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="font-display text-3xl text-ink">Configurações</h1>
        <p className="mt-1 text-sm text-muted">
          Ajuste os dados do salão, horários, notificações e integrações.
        </p>
      </div>

      {/* Abas */}
      <div className="flex flex-wrap gap-2">
        {abas.map(({ chave, label, Icon }) => (
          <button
            key={chave}
            onClick={() => setAba(chave)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              aba === chave
                ? "bg-primary text-primary-fg shadow-soft"
                : "border border-line bg-surface text-ink/70 hover:border-primary/40 hover:text-ink",
            )}
          >
            <Icon width={16} height={16} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Salão ───────────────────────────────── */}
      {aba === "salao" && (
        <Card className="p-6">
          <h2 className="text-base font-semibold text-ink">Dados do salão</h2>
          <p className="mt-1 text-sm text-muted">
            Essas informações aparecem no link de agendamento e nos recibos.
          </p>

          <div className="mt-6 flex items-center gap-4 border-b border-line pb-6">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-xl font-semibold text-primary-fg">
              SC
            </span>
            <div>
              <p className="text-sm font-medium text-ink">Logo do salão</p>
              <p className="text-xs text-muted">PNG ou JPG, até 2 MB.</p>
              <Button size="sm" variant="outline" className="mt-2">
                Enviar imagem
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Nome do salão"
              name="nome"
              value={salao.nome}
              onChange={(e) => setSalao({ ...salao, nome: e.target.value })}
            />
            <Input
              label="CNPJ"
              name="cnpj"
              value={salao.cnpj}
              onChange={(e) => setSalao({ ...salao, cnpj: e.target.value })}
            />
            <Input
              label="E-mail de contato"
              name="email"
              type="email"
              value={salao.email}
              onChange={(e) => setSalao({ ...salao, email: e.target.value })}
            />
            <Input
              label="Telefone"
              name="telefone"
              value={salao.telefone}
              onChange={(e) => setSalao({ ...salao, telefone: e.target.value })}
            />
          </div>

          <div className="mt-4">
            <Input
              label="Endereço"
              name="endereco"
              value={salao.endereco}
              onChange={(e) => setSalao({ ...salao, endereco: e.target.value })}
            />
          </div>

          <div className="mt-4 flex flex-col gap-1.5">
            <label
              htmlFor="descricao"
              className="text-xs font-medium uppercase tracking-wide text-muted"
            >
              Descrição
            </label>
            <textarea
              id="descricao"
              rows={3}
              value={salao.descricao}
              onChange={(e) => setSalao({ ...salao, descricao: e.target.value })}
              className="w-full rounded-xl border border-line bg-surface p-3.5 text-sm text-ink placeholder:text-muted/70 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </Card>
      )}

      {/* ── Horários ────────────────────────────── */}
      {aba === "horarios" && (
        <Card className="p-6">
          <h2 className="text-base font-semibold text-ink">
            Horário de funcionamento
          </h2>
          <p className="mt-1 text-sm text-muted">
            Define os horários disponíveis para agendamento online.
          </p>

          <ul className="mt-6 divide-y divide-line">
            {DIAS.map((dia) => {
              const h = horarios[dia];
              return (
                <li
                  key={dia}
                  className="flex flex-wrap items-center justify-between gap-4 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <Toggle
                      checked={h.aberto}
                      onChange={(v) => setDia(dia, { aberto: v })}
                      label={`Abrir ${dia}`}
                    />
                    <span
                      className={cn(
                        "w-20 text-sm font-medium",
                        h.aberto ? "text-ink" : "text-muted",
                      )}
                    >
                      {dia}
                    </span>
                  </div>

                  {h.aberto ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={h.abre}
                        onChange={(e) => setDia(dia, { abre: e.target.value })}
                        className={inputHora}
                        aria-label={`Abertura ${dia}`}
                      />
                      <span className="text-sm text-muted">às</span>
                      <input
                        type="time"
                        value={h.fecha}
                        onChange={(e) => setDia(dia, { fecha: e.target.value })}
                        className={inputHora}
                        aria-label={`Fechamento ${dia}`}
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-muted">Fechado</span>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {/* ── Notificações ────────────────────────── */}
      {aba === "notificacoes" && (
        <Card className="p-6">
          <h2 className="text-base font-semibold text-ink">
            Notificações e automações
          </h2>
          <p className="mt-1 text-sm text-muted">
            Mensagens enviadas automaticamente para clientes e para você.
          </p>

          <ul className="mt-6 divide-y divide-line">
            {notificacoes.map((n) => (
              <li
                key={n.id}
                className="flex items-start justify-between gap-4 py-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{n.titulo}</p>
                  <p className="mt-0.5 text-sm text-muted">{n.descricao}</p>
                </div>
                <Toggle
                  checked={n.ativo}
                  onChange={(v) =>
                    setNotificacoes((ns) =>
                      ns.map((x) => (x.id === n.id ? { ...x, ativo: v } : x)),
                    )
                  }
                  label={n.titulo}
                />
              </li>
            ))}
          </ul>

          <p className="mt-4 rounded-2xl bg-primary-soft/50 p-3.5 text-xs text-muted">
            As automações por WhatsApp exigem a conexão ativa.{" "}
            <Link href="/whatsapp" className="font-medium text-primary underline">
              Conectar WhatsApp
            </Link>
          </p>
        </Card>
      )}

      {/* ── Integrações ─────────────────────────── */}
      {aba === "integracoes" && (
        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="text-base font-semibold text-ink">
              Integrações disponíveis
            </h2>
            <p className="mt-1 text-sm text-muted">
              Conecte o sistema com as ferramentas que você já usa.
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {integracoes.map((i) => (
                <li
                  key={i.id}
                  className="flex flex-col justify-between rounded-2xl border border-line p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                      <i.Icon width={19} height={19} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-ink">{i.nome}</p>
                        <Badge tone={i.conectado ? "success" : "neutral"}>
                          {i.conectado ? "Conectado" : "Desconectado"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted">{i.descricao}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    {i.href ? (
                      <Link href={i.href}>
                        <Button size="sm" variant="outline" className="w-full">
                          {i.conectado ? "Gerenciar" : "Conectar"}
                          <IconArrowRight width={14} height={14} />
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" variant="outline" className="w-full">
                        {i.conectado ? "Gerenciar" : "Conectar"}
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* API pública */}
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <IconLock width={18} height={18} className="text-primary" />
              <h2 className="text-base font-semibold text-ink">API pública</h2>
            </div>
            <p className="mt-1 text-sm text-muted">
              Use esta chave para integrar o agendamento com n8n, site ou app
              próprio.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <code className="flex-1 truncate rounded-xl border border-line bg-bg/50 px-3.5 py-2.5 text-sm text-ink">
                sk_live_••••••••••••••••••••••••7f3a
              </code>
              <Button variant="outline" size="sm">
                Revelar
              </Button>
              <Button variant="outline" size="sm">
                Gerar nova
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Assinatura ──────────────────────────── */}
      {aba === "assinatura" && <AbaAssinatura />}

      {/* Barra de ações (não aplicável à aba de assinatura) */}
      {aba !== "assinatura" && aba !== "integracoes" && (
        <div className="flex items-center justify-end gap-3">
          {salvo && (
            <span className="flex items-center gap-1.5 text-sm text-success">
              <IconCheck width={16} height={16} />
              Alterações salvas
            </span>
          )}
          <Button variant="outline">Cancelar</Button>
          <Button onClick={salvar}>Salvar alterações</Button>
        </div>
      )}
    </div>
  );
}
