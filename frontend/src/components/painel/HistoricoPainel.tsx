import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatarDataHora } from "@/lib/rotulos";
import { STATUS_LABEL } from "@/lib/statusSolicitacao";
import type { HistoricoStatusResponse } from "@/lib/types";

/** Linha do tempo das mudanças de status, da mais recente pra mais antiga. */
export function HistoricoPainel({ historico }: { historico: HistoricoStatusResponse[] }) {
  const eventos = [...historico].sort(
    (a, b) => new Date(b.ocorridoEm).getTime() - new Date(a.ocorridoEm).getTime(),
  );

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="font-display text-lg">Histórico</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative grid gap-5 border-l border-border pl-5">
          {eventos.map((h, i) => (
            <li key={`${h.ocorridoEm}-${i}`} className="relative grid gap-1 text-sm">
              <span
                aria-hidden
                className={
                  "absolute top-1 -left-[1.6rem] size-2.5 rounded-full ring-4 ring-card " +
                  (i === 0 ? "bg-primary" : "bg-border")
                }
              />
              <p className="font-medium">{STATUS_LABEL[h.statusNovo]}</p>
              <p className="text-xs text-muted-foreground">
                {formatarDataHora(h.ocorridoEm)}
                {h.analistaNome ? ` · ${h.analistaNome}` : ""}
              </p>
              {h.observacao && (
                <p className="rounded-md bg-muted/60 px-3 py-2 text-pretty">{h.observacao}</p>
              )}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
