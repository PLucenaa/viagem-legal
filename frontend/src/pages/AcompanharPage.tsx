import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { consultarPorProtocolo, ApiError } from "@/lib/api";
import type { ConsultaProtocoloResponse, StatusSolicitacao } from "@/lib/types";

const STATUS_LABEL: Record<StatusSolicitacao, string> = {
  RECEBIDA: "Recebida",
  EM_ANALISE: "Em análise",
  PENDENTE_CORRECAO: "Pendente de correção",
  DEFERIDA: "Deferida",
  INDEFERIDA: "Indeferida",
  AGUARDANDO_ASSINATURA: "Aguardando assinatura",
  CONCLUIDA: "Concluída",
};

export function AcompanharPage() {
  const [params] = useSearchParams();
  const [protocolo, setProtocolo] = useState(params.get("protocolo") ?? "");
  const [dados, setDados] = useState<ConsultaProtocoloResponse | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function consultar(p: string) {
    if (!p.trim()) return;
    setCarregando(true);
    setErro(null);
    setDados(null);
    try {
      setDados(await consultarPorProtocolo(p.trim()));
    } catch (e) {
      setErro(
        e instanceof ApiError ? e.message : "Não foi possível consultar.",
      );
    } finally {
      setCarregando(false);
    }
  }

  // Consulta automática se veio protocolo na URL (após criar a solicitação).
  useEffect(() => {
    const p = params.get("protocolo");
    if (p) consultar(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-left">
      <div className="mb-6">
        <Button asChild variant="link" size="sm" className="px-0">
          <Link to="/">← Voltar</Link>
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">
          Acompanhar solicitação
        </h1>
        <p className="text-sm text-muted-foreground">
          Informe o número do protocolo recebido ao enviar o pedido.
        </p>
      </div>

      <form
        className="mb-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          consultar(protocolo);
        }}
      >
        <Input
          placeholder="VL-2026-000000"
          value={protocolo}
          onChange={(e) => setProtocolo(e.target.value)}
        />
        <Button type="submit" disabled={carregando}>
          {carregando ? "Consultando..." : "Consultar"}
        </Button>
      </form>

      {erro && <p className="text-sm text-destructive">{erro}</p>}

      {dados && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{dados.protocolo}</CardTitle>
              <Badge>{STATUS_LABEL[dados.status]}</Badge>
            </div>
            <CardDescription>
              {dados.menorNome ? `Menor: ${dados.menorNome}` : null}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="mb-3 text-sm font-medium text-foreground">
              Histórico
            </h3>
            <ol className="space-y-3">
              {dados.historico.map((h, i) => (
                <li key={i} className="border-l-2 border-primary/40 pl-3">
                  <div className="text-sm font-medium text-foreground">
                    {STATUS_LABEL[h.statusNovo]}
                  </div>
                  {h.observacao && (
                    <div className="text-sm text-muted-foreground">
                      {h.observacao}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {new Date(h.ocorridoEm).toLocaleString("pt-BR")}
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
