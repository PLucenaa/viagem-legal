import { CircleAlert, ExternalLink, FileImage, FileText } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { anexoUrl } from "@/lib/api";
import { formatarDataHora } from "@/lib/rotulos";
import { anexosEsperados, TIPO_ANEXO_LABEL } from "@/lib/tipoAnexo";
import type { SolicitacaoResponse } from "@/lib/types";

function formatarTamanho(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

/**
 * Documentos enviados + o que ainda falta, conforme o tipo do pedido —
 * a conferência é o grosso do trabalho do analista, então vem primeiro.
 */
export function DocumentosPainel({ solicitacao }: { solicitacao: SolicitacaoResponse }) {
  const enviados = new Set(solicitacao.anexos.map((a) => a.tipo));
  const faltando = anexosEsperados(solicitacao).filter((t) => !enviados.has(t));
  const anexos = [...solicitacao.anexos].sort((a, b) =>
    TIPO_ANEXO_LABEL[a.tipo].localeCompare(TIPO_ANEXO_LABEL[b.tipo], "pt-BR"),
  );

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="font-display text-lg">Documentos</CardTitle>
        <CardDescription>
          {anexos.length === 0
            ? "Nenhum documento enviado ainda."
            : anexos.length === 1
              ? "1 documento enviado."
              : `${anexos.length} documentos enviados.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-[minmax(0,1fr)] gap-4">
        {faltando.length > 0 && (
          <div className="rounded-lg border border-estrada/40 bg-estrada/5 p-4 text-sm">
            <p className="mb-2 flex items-center gap-2 font-medium text-estrada">
              <CircleAlert className="size-4" aria-hidden />
              {faltando.length === 1 ? "Falta 1 documento" : `Faltam ${faltando.length} documentos`}
            </p>
            <ul className="grid gap-1 pl-6 text-foreground">
              {faltando.map((t) => (
                <li key={t} className="list-disc">
                  {TIPO_ANEXO_LABEL[t]}
                </li>
              ))}
            </ul>
          </div>
        )}

        {anexos.length > 0 && (
          <ul className="divide-y rounded-lg border">
            {anexos.map((a) => {
              const Icone = a.contentType.startsWith("image/") ? FileImage : FileText;
              return (
                <li key={a.id} className="flex items-center gap-3 p-3">
                  <Icone className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{TIPO_ANEXO_LABEL[a.tipo]}</p>
                    <p className="truncate text-xs text-muted-foreground" title={a.nomeArquivo}>
                      {a.nomeArquivo} · {formatarTamanho(a.tamanhoBytes)} ·{" "}
                      {formatarDataHora(a.enviadoEm)}
                    </p>
                  </div>
                  <a
                    href={anexoUrl(a.id)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Abrir ${TIPO_ANEXO_LABEL[a.tipo]} (${a.nomeArquivo}) em nova aba`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-foreground outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    Abrir
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
