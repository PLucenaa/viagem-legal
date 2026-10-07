import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CircleCheck, FileCheck2, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OpcoesRadio, type OpcaoRadio } from "@/components/form/OpcoesRadio";
import { ApiError, assumirSolicitacao, mudarStatusSolicitacao } from "@/lib/api";
import {
  emAberto,
  observacaoObrigatoria,
  STATUS_LABEL,
  TRANSICOES_PERMITIDAS,
} from "@/lib/statusSolicitacao";
import type { SolicitacaoResponse, StatusSolicitacao } from "@/lib/types";

/** O que cada decisão faz, do ponto de vista de quem decide. */
const DECISAO: Partial<Record<StatusSolicitacao, { rotulo: string; descricao: string }>> = {
  EM_ANALISE: {
    rotulo: "Retomar análise",
    descricao: "Volta o pedido pra análise depois da correção do cidadão.",
  },
  PENDENTE_CORRECAO: {
    rotulo: "Pedir correção",
    descricao: "O cidadão vê sua observação e pode reenviar documentos.",
  },
  DEFERIDA: {
    rotulo: "Deferir",
    descricao: "Aprova o pedido. O cidadão já consegue ver e imprimir a autorização.",
  },
  INDEFERIDA: {
    rotulo: "Indeferir",
    descricao: "Encerra o pedido. Explique o motivo na observação.",
  },
  AGUARDANDO_ASSINATURA: {
    rotulo: "Enviar para assinatura",
    descricao: "A autorização fica aguardando assinatura.",
  },
  CONCLUIDA: {
    rotulo: "Concluir",
    descricao: "Autorização assinada. Encerra o pedido.",
  },
};

interface DecisaoPainelProps {
  solicitacao: SolicitacaoResponse;
  /** "sub" do analista logado. */
  meuId?: string;
  onAtualizada: (s: SolicitacaoResponse) => void;
  /** Outra pessoa mexeu no pedido (409): recarregar a tela. */
  onConflito: () => void;
  onProxima: () => void;
  buscandoProxima: boolean;
}

/**
 * Onde o analista age: assumir o pedido e decidir o próximo passo. Fica ao
 * lado dos dados (fixo ao rolar) pra decidir sem perder os documentos de vista.
 */
export function DecisaoPainel({
  solicitacao: s,
  meuId,
  onAtualizada,
  onConflito,
  onProxima,
  buscandoProxima,
}: DecisaoPainelProps) {
  const idObservacao = useId();
  // Se o cidadão já respondeu à correção, o passo natural é retomar a
  // análise — fica pré-selecionado, mas ainda precisa confirmar.
  const [escolha, setEscolha] = useState<StatusSolicitacao | null>(
    s.correcaoRecebida ? "EM_ANALISE" : null,
  );
  const [observacao, setObservacao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [confirmandoAssumir, setConfirmandoAssumir] = useState(false);
  /** Decisão que acabou de ser aplicada — mostra o "próxima da fila". */
  const [decidido, setDecidido] = useState<StatusSolicitacao | null>(null);

  const ehMeu = !!meuId && s.analistaId === meuId;
  const deOutraPessoa = !!s.analistaId && !ehMeu;
  const aberto = emAberto(s.status);
  // "Recebida → Em análise" acontece ao assumir, não como decisão.
  const opcoes: OpcaoRadio<StatusSolicitacao>[] = TRANSICOES_PERMITIDAS[s.status]
    .filter((st) => !(s.status === "RECEBIDA" && st === "EM_ANALISE"))
    .map((st) => ({ valor: st, rotulo: DECISAO[st]?.rotulo ?? STATUS_LABEL[st], descricao: DECISAO[st]?.descricao }));
  const obrigatoria = escolha ? observacaoObrigatoria(escolha) : false;

  function tratarErro(e: unknown, padrao: string) {
    toast.error(e instanceof ApiError ? e.message : padrao);
    if (e instanceof ApiError && e.status === 409) {
      setEscolha(null);
      onConflito();
    }
  }

  async function assumir() {
    setEnviando(true);
    try {
      onAtualizada(await assumirSolicitacao(s.id, s.versao));
      setConfirmandoAssumir(false);
      toast.success("Pedido assumido. Agora ele está com você.");
    } catch (e) {
      tratarErro(e, "Não foi possível assumir o pedido.");
    } finally {
      setEnviando(false);
    }
  }

  async function decidir() {
    if (!escolha) return;
    if (obrigatoria && !observacao.trim()) {
      toast.error("Escreva a observação: ela é obrigatória para essa decisão.");
      return;
    }
    setEnviando(true);
    try {
      const atualizada = await mudarStatusSolicitacao(s.id, {
        novoStatus: escolha,
        observacao: observacao.trim() || undefined,
        versao: s.versao,
      });
      onAtualizada(atualizada);
      setDecidido(escolha);
      setEscolha(null);
      setObservacao("");
    } catch (e) {
      tratarErro(e, "Não foi possível registrar a decisão.");
    } finally {
      setEnviando(false);
    }
  }

  if (decidido) {
    return (
      <Card className="gap-4 border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <CircleCheck className="size-5 text-primary" aria-hidden />
            Decisão registrada
          </CardTitle>
          <CardDescription>
            O pedido agora está como <strong>{STATUS_LABEL[decidido]}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Button className="gap-2" disabled={buscandoProxima} onClick={onProxima}>
            {buscandoProxima ? "Procurando…" : "Próximo pedido da fila"}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
          <Button asChild variant="outline">
            <Link to="/painel">Voltar para a fila</Link>
          </Button>
          {aberto && (
            <Button variant="ghost" size="sm" onClick={() => setDecidido(null)}>
              Continuar neste pedido
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-5">
      <CardHeader>
        <CardTitle className="font-display text-lg">Decisão</CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <UserRound className="size-4" aria-hidden />
          {!s.analistaNome ? "Sem responsável" : ehMeu ? "Está com você" : `Está com ${s.analistaNome}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-5">
        {s.correcaoRecebida && (
          <div className="flex gap-3 rounded-lg border border-rio/40 bg-rio/10 p-4 text-sm">
            <FileCheck2 className="mt-0.5 size-4 shrink-0 text-rio" aria-hidden />
            <p>
              O cidadão enviou documento depois do pedido de correção. Confira os
              documentos marcados como <strong>Novo</strong> e retome a análise.
            </p>
          </div>
        )}

        {!aberto && (
          <div className="grid gap-2 text-sm">
            <p>
              Pedido finalizado como <strong>{STATUS_LABEL[s.status]}</strong>. Não há
              mais decisões a tomar.
            </p>
            {s.observacaoAnalista && (
              <p className="rounded-md bg-muted/60 px-3 py-2 text-pretty">
                {s.observacaoAnalista}
              </p>
            )}
          </div>
        )}

        {/* Assumir: direto quando ninguém está com o pedido; com confirmação
            quando ele é de outra pessoa. */}
        {aberto && !ehMeu && (
          <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 text-sm">
            {deOutraPessoa ? (
              confirmandoAssumir ? (
                <>
                  <p>
                    O pedido sai de <strong>{s.analistaNome}</strong> e passa para você.
                    Combine com a pessoa antes, se puder.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" disabled={enviando} onClick={assumir}>
                      Assumir mesmo assim
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmandoAssumir(false)}>
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p>Outra pessoa está cuidando deste pedido.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="justify-self-start"
                    onClick={() => setConfirmandoAssumir(true)}
                  >
                    Assumir para mim
                  </Button>
                </>
              )
            ) : (
              <>
                <p>
                  {s.status === "RECEBIDA"
                    ? "Assuma o pedido para começar a análise."
                    : "Ninguém está cuidando deste pedido."}
                </p>
                <Button className="justify-self-start" disabled={enviando} onClick={assumir}>
                  {s.status === "RECEBIDA" ? "Assumir e iniciar análise" : "Assumir"}
                </Button>
              </>
            )}
          </div>
        )}

        {aberto && opcoes.length > 0 && (
          <fieldset className="grid gap-4" disabled={enviando}>
            <legend className="mb-3 text-sm font-medium">Próximo passo</legend>
            <OpcoesRadio
              aria-label="Próximo passo"
              opcoes={opcoes}
              value={escolha ?? ("" as StatusSolicitacao)}
              onValueChange={setEscolha}
              className="grid-cols-1"
            />

            {escolha && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor={idObservacao}>
                    Observação {obrigatoria ? "(obrigatória)" : "(opcional)"}
                  </Label>
                  <Textarea
                    id={idObservacao}
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    aria-describedby={`${idObservacao}-dica`}
                    aria-required={obrigatoria}
                    rows={4}
                    placeholder={
                      escolha === "PENDENTE_CORRECAO"
                        ? "Ex.: O comprovante de residência está ilegível. Envie uma foto mais nítida."
                        : escolha === "INDEFERIDA"
                          ? "Ex.: O requerente não reside em Boa Vista/RR."
                          : undefined
                    }
                  />
                  <p id={`${idObservacao}-dica`} className="text-xs text-muted-foreground">
                    O cidadão vê esta observação na tela de acompanhamento.
                  </p>
                </div>

                <Button
                  variant={escolha === "INDEFERIDA" ? "destructive" : "default"}
                  disabled={enviando}
                  onClick={decidir}
                >
                  {enviando ? "Registrando…" : `Confirmar: ${DECISAO[escolha]?.rotulo ?? STATUS_LABEL[escolha]}`}
                </Button>
              </>
            )}
          </fieldset>
        )}
      </CardContent>
    </Card>
  );
}
