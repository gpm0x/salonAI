"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { KpiCard } from "@/components/shared/KpiCard";
import {
  ConexaoWhatsApp,
  type StatusConexao,
} from "@/components/whatsapp/ConexaoWhatsApp";
import { CaixaMensagens } from "@/components/whatsapp/CaixaMensagens";
import { IconWhatsApp, IconMail, IconClock, IconBell } from "@/components/ui/icons";
import { resumoWhatsApp } from "@/lib/mock-data";

const NUMERO_DEMO = "+55 (11) 99876-5432";

const statusBadge: Record<
  StatusConexao,
  { label: string; tone: "success" | "accent" | "neutral" }
> = {
  desconectado: { label: "Desconectado", tone: "neutral" },
  aguardando: { label: "Aguardando leitura", tone: "accent" },
  conectando: { label: "Conectando…", tone: "accent" },
  conectado: { label: "Conectado", tone: "success" },
};

export function WhatsAppView() {
  const [status, setStatus] = useState<StatusConexao>("desconectado");
  const [qrSeed, setQrSeed] = useState("inicial");

  function novoSeed() {
    setQrSeed(`${Date.now()}-${Math.random()}`);
  }

  function conectar() {
    novoSeed();
    setStatus("aguardando");
  }

  function simular() {
    setStatus("conectando");
    setTimeout(() => setStatus("conectado"), 1600);
  }

  function desconectar() {
    setStatus("desconectado");
  }

  const badge = statusBadge[status];
  const conectado = status === "conectado";

  return (
    <div className="mx-auto max-w-7xl animate-fade-up space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-3xl text-ink">WhatsApp</h1>
            <Badge tone={badge.tone}>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  conectado ? "bg-success" : "bg-current"
                } ${status === "aguardando" || status === "conectando" ? "animate-pulse" : ""}`}
              />
              {badge.label}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted">
            Conecte o WhatsApp do salão e acompanhe as conversas com os clientes.
          </p>
        </div>
      </div>

      {/* Conexão */}
      <ConexaoWhatsApp
        status={status}
        qrSeed={qrSeed}
        numero={NUMERO_DEMO}
        conectadoDesde="agora há pouco"
        onConectar={conectar}
        onRegenerar={conectar}
        onSimular={simular}
        onDesconectar={desconectar}
      />

      {/* Conteúdo pós-conexão */}
      {conectado ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              icon={<IconWhatsApp width={19} height={19} />}
              label="Conversas"
              valor={String(resumoWhatsApp.conversas)}
              variacao={14}
              sufixo="nos últimos 7 dias"
            />
            <KpiCard
              icon={<IconMail width={19} height={19} />}
              label="Mensagens não lidas"
              valor={String(resumoWhatsApp.naoLidas)}
              variacao={-9}
              quedaBoa
              sufixo={`${resumoWhatsApp.comPendencia} conversas pendentes`}
            />
            <KpiCard
              icon={<IconClock width={19} height={19} />}
              label="Tempo médio de resposta"
              valor={resumoWhatsApp.tempoMedioResposta}
              variacao={-18}
              quedaBoa
              sufixo="mais rápido é melhor"
            />
            <KpiCard
              icon={<IconBell width={19} height={19} />}
              label="Lembretes enviados"
              valor="128"
              variacao={22}
              sufixo="confirmações automáticas"
            />
          </div>

          <CaixaMensagens />
        </>
      ) : (
        <p className="text-center text-sm text-muted">
          Conecte o WhatsApp para visualizar as conversas e responder aos clientes.
        </p>
      )}
    </div>
  );
}
