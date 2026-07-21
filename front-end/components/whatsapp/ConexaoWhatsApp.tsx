"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { QRCode } from "@/components/whatsapp/QRCode";
import {
  IconWhatsApp,
  IconQr,
  IconPhone,
  IconCheck,
} from "@/components/ui/icons";

export type StatusConexao =
  | "desconectado"
  | "aguardando"
  | "conectando"
  | "conectado";

interface ConexaoWhatsAppProps {
  status: StatusConexao;
  qrSeed: string;
  numero: string;
  conectadoDesde: string;
  onConectar: () => void;
  onRegenerar: () => void;
  onSimular: () => void;
  onDesconectar: () => void;
}

const EXPIRA_EM = 40; // segundos

const passos = [
  "Abra o WhatsApp no seu celular",
  "Toque em Mais opções ⋮ e depois em Aparelhos conectados",
  "Toque em Conectar um aparelho",
  "Aponte a câmera do celular para este código",
];

export function ConexaoWhatsApp({
  status,
  qrSeed,
  numero,
  conectadoDesde,
  onConectar,
  onRegenerar,
  onSimular,
  onDesconectar,
}: ConexaoWhatsAppProps) {
  const [restante, setRestante] = useState(EXPIRA_EM);

  // reinicia a contagem sempre que um novo QR é gerado
  useEffect(() => {
    if (status !== "aguardando") return;
    setRestante(EXPIRA_EM);
    const id = setInterval(() => {
      setRestante((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [qrSeed, status]);

  const expirado = status === "aguardando" && restante === 0;

  // ── Estado conectado ────────────────────────────────
  if (status === "conectado") {
    return (
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-success/12 text-success">
              <IconWhatsApp width={24} height={24} />
              <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-success text-primary-fg ring-2 ring-surface">
                <IconCheck width={12} height={12} />
              </span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-ink">
                  WhatsApp conectado
                </h3>
                <Badge tone="success">Online</Badge>
              </div>
              <p className="mt-0.5 text-sm text-muted">
                <span className="nums">{numero}</span> · conectado {conectadoDesde}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onDesconectar}>
            Desconectar
          </Button>
        </div>
      </Card>
    );
  }

  // ── Estados de conexão (QR) ─────────────────────────
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
        {/* Instruções */}
        <div>
          <div className="flex items-center gap-2 text-primary">
            <IconWhatsApp width={20} height={20} />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Conectar WhatsApp
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl text-ink">
            Use o WhatsApp do salão no sistema
          </h2>
          <p className="mt-2 text-sm text-muted">
            Escaneie o código com o celular para sincronizar as conversas.
            A conexão é feita via API, sem precisar deixar o navegador aberto.
          </p>

          <ol className="mt-5 space-y-3">
            {passos.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="text-sm text-ink/80">{p}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Área do QR */}
        <div className="flex flex-col items-center">
          <div className="relative aspect-square w-full max-w-[260px] overflow-hidden rounded-3xl border border-line bg-white p-4 shadow-soft">
            {status === "desconectado" && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <IconQr width={28} height={28} />
                </span>
                <p className="px-4 text-sm text-muted">
                  Gere o código para começar a conexão
                </p>
              </div>
            )}

            {(status === "aguardando" || status === "conectando") && (
              <div className="relative h-full w-full">
                <div className={expirado ? "opacity-20 blur-[1px]" : ""}>
                  <QRCode seed={qrSeed} />
                </div>

                {status === "conectando" && (
                  <div className="absolute inset-0 grid place-items-center bg-white/80">
                    <div className="flex flex-col items-center gap-3">
                      <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary/25 border-t-primary" />
                      <p className="text-sm font-medium text-ink">
                        Conectando…
                      </p>
                    </div>
                  </div>
                )}

                {expirado && (
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <p className="text-sm font-semibold text-ink">
                        Código expirado
                      </p>
                      <Button size="sm" onClick={onRegenerar}>
                        Gerar novo código
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ações abaixo do QR */}
          <div className="mt-5 flex w-full max-w-[260px] flex-col items-center gap-3">
            {status === "desconectado" && (
              <Button className="w-full" onClick={onConectar}>
                <IconQr width={17} height={17} />
                Gerar QR Code
              </Button>
            )}

            {status === "aguardando" && !expirado && (
              <>
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                  Aguardando leitura · expira em{" "}
                  <span className="nums font-medium text-ink">{restante}s</span>
                </p>
                <div className="flex w-full gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onRegenerar}
                  >
                    Novo código
                  </Button>
                  {/* Ação de demonstração — substituir pelo callback real da API */}
                  <Button className="flex-1" onClick={onSimular}>
                    <IconPhone width={16} height={16} />
                    Simular leitura
                  </Button>
                </div>
              </>
            )}

            {status === "conectando" && (
              <p className="text-xs text-muted">
                Validando sessão do dispositivo…
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
