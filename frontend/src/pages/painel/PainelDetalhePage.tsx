import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ApiError,
  detalharSolicitacao,
  mudarStatusSolicitacao,
} from "@/lib/api";
import {
  observacaoObrigatoria,
  STATUS_BADGE_VARIANT,
  STATUS_LABEL,
  TRANSICOES_PERMITIDAS,
} from "@/lib/statusSolicitacao";
import type { SolicitacaoResponse, StatusSolicitacao } from "@/lib/types";

function Campo({ label, valor }: { label: string; valor?: string | null }) {
  if (!valor) return null;
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd>{valor}</dd>
    </div>
  );
}

export function PainelDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const [solicitacao, setSolicitacao] = useState<SolicitacaoResponse | null>(
    null,
  );
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [observacao, setObservacao] = useState("");
  const [statusEscolhido, setStatusEscolhido] =
    useState<StatusSolicitacao | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelado = false;
    detalharSolicitacao(Number(id))
      .then((res) => {
        if (cancelado) return;
        setSolicitacao(res);
        setErro(null);
      })
      .catch((e) => {
        if (cancelado) return;
        setErro(
          e instanceof ApiError
            ? e.message
            : "Não foi possível carregar a solicitação.",
        );
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [id]);

  async function aplicarTransicao(novoStatus: StatusSolicitacao) {
    if (!solicitacao) return;
    if (observacaoObrigatoria(novoStatus) && !observacao.trim()) {
      toast.error("Informe uma observação para essa mudança de status.");
      return;
    }
    setEnviando(true);
    try {
      const atualizado = await mudarStatusSolicitacao(solicitacao.id, {
        novoStatus,
        observacao: observacao.trim() || undefined,
      });
      setSolicitacao(atualizado);
      setObservacao("");
      setStatusEscolhido(null);
      toast.success(`Status alterado para ${STATUS_LABEL[novoStatus]}.`);
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "Não foi possível mudar o status.",
      );
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return <p className="mx-auto max-w-4xl px-4 py-10 text-muted-foreground">Carregando…</p>;
  }

  if (erro || !solicitacao) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-destructive">{erro ?? "Não encontrado."}</p>
        <Button asChild variant="link" className="mt-2 px-0">
          <Link to="/painel">← Voltar</Link>
        </Button>
      </div>
    );
  }

  const transicoes = TRANSICOES_PERMITIDAS[solicitacao.status];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 text-left">
      <header className="mb-6">
        <Button asChild variant="link" className="px-0">
          <Link to="/painel">← Voltar para a lista</Link>
        </Button>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {solicitacao.protocolo}
          </h1>
          <Badge variant={STATUS_BADGE_VARIANT[solicitacao.status]}>
            {STATUS_LABEL[solicitacao.status]}
          </Badge>
        </div>
      </header>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Requerente</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Campo label="Nome" valor={solicitacao.requerente.nomeCompleto} />
              <Campo label="CPF" valor={solicitacao.requerente.cpf} />
              <Campo label="Telefone" valor={solicitacao.requerente.telefone} />
              <Campo label="E-mail" valor={solicitacao.requerente.email} />
              <Campo
                label="Qualidade"
                valor={solicitacao.tipoResponsavel}
              />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Criança/adolescente</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Campo label="Nome" valor={solicitacao.menor.nomeCompleto} />
              <Campo
                label="Data de nascimento"
                valor={solicitacao.menor.dataNascimento}
              />
              <Campo label="Naturalidade" valor={solicitacao.menor.naturalidade} />
              <Campo
                label="Documento"
                valor={solicitacao.menor.numeroDocumento}
              />
            </dl>
          </CardContent>
        </Card>

        {solicitacao.responsavel?.nomeCompleto && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acompanhante/responsável</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 sm:grid-cols-2">
                <Campo label="Nome" valor={solicitacao.responsavel.nomeCompleto} />
                <Campo label="CPF" valor={solicitacao.responsavel.cpf} />
                <Campo label="Telefone" valor={solicitacao.responsavel.telefone} />
              </dl>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Viagem</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Campo label="Destino" valor={solicitacao.dadosViagem.destino} />
              <Campo label="Data de ida" valor={solicitacao.dadosViagem.dataIda} />
              <Campo label="Data de volta" valor={solicitacao.dadosViagem.dataVolta} />
              <Campo
                label="Meio de transporte"
                valor={solicitacao.dadosViagem.meioTransporte}
              />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Anexos ({solicitacao.anexos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {solicitacao.anexos.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum anexo enviado ainda.
              </p>
            ) : (
              <ul className="space-y-1 text-sm">
                {solicitacao.anexos.map((a) => (
                  <li key={a.id} className="flex justify-between gap-2">
                    <span>
                      {a.tipo} — {a.nomeArquivo}
                    </span>
                    <span className="text-muted-foreground">
                      {(a.tamanhoBytes / 1024).toFixed(0)} KB
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Histórico</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {solicitacao.historico.map((h, i) => (
                <li key={i} className="border-b pb-2 last:border-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={STATUS_BADGE_VARIANT[h.statusNovo]}>
                      {STATUS_LABEL[h.statusNovo]}
                    </Badge>
                    <span className="text-muted-foreground">
                      {new Date(h.ocorridoEm).toLocaleString("pt-BR")}
                    </span>
                    {h.analistaNome && (
                      <span className="text-muted-foreground">
                        · {h.analistaNome}
                      </span>
                    )}
                  </div>
                  {h.observacao && <p className="mt-1">{h.observacao}</p>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {transicoes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mudar status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {transicoes.map((s) => (
                  <Button
                    key={s}
                    variant={statusEscolhido === s ? "default" : "outline"}
                    onClick={() => setStatusEscolhido(s)}
                  >
                    {STATUS_LABEL[s]}
                  </Button>
                ))}
              </div>

              {statusEscolhido && (
                <>
                  <Textarea
                    placeholder={
                      observacaoObrigatoria(statusEscolhido)
                        ? "Observação (obrigatória para essa mudança)"
                        : "Observação (opcional)"
                    }
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                  />
                  <Button
                    disabled={enviando}
                    onClick={() => aplicarTransicao(statusEscolhido)}
                  >
                    Confirmar: {STATUS_LABEL[statusEscolhido]}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
