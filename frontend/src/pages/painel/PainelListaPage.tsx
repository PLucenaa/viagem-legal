import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError, listarSolicitacoes } from "@/lib/api";
import { STATUS_BADGE_VARIANT, STATUS_LABEL } from "@/lib/statusSolicitacao";
import type { Page, SolicitacaoResumoResponse, StatusSolicitacao } from "@/lib/types";

const TODOS_STATUS = Object.keys(STATUS_LABEL) as StatusSolicitacao[];

export function PainelListaPage() {
  const [status, setStatus] = useState<StatusSolicitacao | "TODOS">("TODOS");
  const [pagina, setPagina] = useState(0);
  const [dados, setDados] = useState<Page<SolicitacaoResumoResponse> | null>(
    null,
  );
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    listarSolicitacoes(status === "TODOS" ? undefined : status, pagina)
      .then((res) => {
        if (cancelado) return;
        setDados(res);
        setErro(null);
      })
      .catch((e) => {
        if (cancelado) return;
        setErro(
          e instanceof ApiError
            ? e.message
            : "Não foi possível carregar as solicitações.",
        );
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [status, pagina]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 text-left">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Painel interno — Solicitações
        </h1>
        <p className="mt-2 text-muted-foreground">
          Fila de solicitações de autorização de viagem para conferência e
          autorização.
        </p>
      </header>

      <div className="mb-4 flex items-center gap-3">
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as StatusSolicitacao | "TODOS");
            setPagina(0);
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos os status</SelectItem>
            {TODOS_STATUS.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {erro && <p className="text-sm text-destructive">{erro}</p>}
      {!erro && carregando && (
        <p className="text-muted-foreground">Carregando…</p>
      )}

      {!erro && !carregando && dados && (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Protocolo</th>
                  <th className="px-3 py-2 font-medium">Requerente</th>
                  <th className="px-3 py-2 font-medium">Menor</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Criado em</th>
                </tr>
              </thead>
              <tbody>
                {dados.content.map((s) => (
                  <tr key={s.id} className="border-t hover:bg-muted/20">
                    <td className="px-3 py-2">
                      <Link
                        to={`/painel/${s.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {s.protocolo}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{s.requerenteNome ?? "—"}</td>
                    <td className="px-3 py-2">{s.menorNome ?? "—"}</td>
                    <td className="px-3 py-2">
                      <Badge variant={STATUS_BADGE_VARIANT[s.status]}>
                        {STATUS_LABEL[s.status]}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {new Date(s.criadoEm).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
                {dados.content.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-6 text-center text-muted-foreground"
                    >
                      Nenhuma solicitação encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Página {dados.number + 1} de {Math.max(dados.totalPages, 1)} ·{" "}
              {dados.totalElements} solicitações
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagina === 0}
                onClick={() => setPagina((p) => p - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagina + 1 >= dados.totalPages}
                onClick={() => setPagina((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
