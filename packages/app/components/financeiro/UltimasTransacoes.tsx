import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconWallet } from "@/components/ui/icons";
import { ultimasTransacoes, formatBRLCents, type Transacao } from "@/lib/mock-data";

const tomForma: Record<Transacao["forma"], "primary" | "accent" | "success" | "neutral"> = {
  Pix: "primary",
  Crédito: "accent",
  Débito: "success",
  Dinheiro: "neutral",
};

function formatData(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function UltimasTransacoes() {
  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center gap-2">
        <IconWallet width={18} height={18} className="text-primary" />
        <h3 className="text-base font-semibold text-ink">
          Últimas transações
        </h3>
      </div>

      <div className="mt-4 -mx-2 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-2 pb-3 font-medium">Data</th>
              <th className="px-2 pb-3 font-medium">Cliente</th>
              <th className="px-2 pb-3 font-medium">Serviço</th>
              <th className="px-2 pb-3 font-medium">Pagamento</th>
              <th className="px-2 pb-3 text-right font-medium">Valor</th>
            </tr>
          </thead>
          <tbody>
            {ultimasTransacoes.map((t, i) => (
              <tr key={i} className="border-t border-line">
                <td className="whitespace-nowrap px-2 py-3 text-muted nums">
                  {formatData(t.data)}
                </td>
                <td className="px-2 py-3 font-medium text-ink">{t.cliente}</td>
                <td className="px-2 py-3 text-muted">
                  {t.servico}
                  <span className="block text-xs text-muted/70">
                    {t.profissional}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <Badge tone={tomForma[t.forma]}>{t.forma}</Badge>
                </td>
                <td className="whitespace-nowrap px-2 py-3 text-right font-semibold text-ink nums">
                  {formatBRLCents(t.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
