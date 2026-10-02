import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Inbox, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CardSolicitacao } from "@/components/painel/CardSolicitacao";
import {
  ApiError,
  assumirSolicitacao,
  contarSolicitacoes,
  listarSolicitacoes,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ABAS_PAINEL } from "@/lib/statusSolicitacao";
import type {
  ContagemPainelResponse,
  Page,
  SolicitacaoResumoResponse,
} from "@/lib/types";

/** A fila se atualiza sozinha: um pedido novo aparece sem recarregar. */
const INTERVALO_ATUALIZACAO_MS = 60_000;

export function PainelListaPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  // Aba, busca, filtro e página ficam na URL: ao voltar do detalhe, o
  // analista cai exatamente onde estava.
  const [params, setParams] = useSearchParams();
  const abaId = params.get("aba") ?? ABAS_PAINEL[0].id;
  const aba = ABAS_PAINEL.find((a) => a.id === abaId) ?? ABAS_PAINEL[0];
  const busca = params.get("busca") ?? "";
  const minhas = params.get("minhas") === "1";
  const pagina = Number(params.get("pagina") ?? 0);

  const [buscaDigitada, setBuscaDigitada] = useState(busca);
  const [dados, setDados] = useState<Page<SolicitacaoResumoResponse> | null>(
    null,
  );
  const [contagem, setContagem] = useState<ContagemPainelResponse | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);
  const [assumindoId, setAssumindoId] = useState<number | null>(null);

  const atualizarParams = useCallback(
    (mudancas: Record<string, string | null>) => {
      setParams(
        (atual) => {
          const novo = new URLSearchParams(atual);
          for (const [chave, valor] of Object.entries(mudancas)) {
            if (valor === null || valor === "") novo.delete(chave);
            else novo.set(chave, valor);
          }
          return novo;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  // Busca com espera: só consulta depois que a pessoa para de digitar.
  useEffect(() => {
    if (buscaDigitada === busca) return;
    const t = setTimeout(
      () => atualizarParams({ busca: buscaDigitada, pagina: null }),
      350,
    );
    return () => clearTimeout(t);
  }, [buscaDigitada, busca, atualizarParams]);

  const buscar = useCallback(
    () =>
      Promise.all([
        listarSolicitacoes({
          statuses: aba.statuses,
          busca,
          minhas,
          page: pagina,
        }),
        contarSolicitacoes(),
      ]),
    [aba, busca, minhas, pagina],
  );

  const aplicar = useCallback(
    ([lista, cont]: [
      Page<SolicitacaoResumoResponse>,
      ContagemPainelResponse,
    ]) => {
      setDados(lista);
      setContagem(cont);
      setErro(null);
      setAtualizadoEm(new Date());
      setCarregando(false);
    },
    [],
  );

  const falhar = useCallback((e: unknown) => {
    setErro(
      e instanceof ApiError ? e.message : "Não foi possível carregar a fila.",
    );
    setCarregando(false);
  }, []);

  /** Recarrega na hora (botão de atualizar, depois de um erro ao assumir). */
  const carregar = useCallback(
    () => buscar().then(aplicar, falhar),
    [buscar, aplicar, falhar],
  );

  // Carrega ao mudar de aba/filtro, a cada minuto e ao voltar pra aba do
  // navegador. "ativo" descarta respostas de um filtro que já foi trocado.
  useEffect(() => {
    let ativo = true;
    const rodar = () =>
      buscar().then(
        (r) => ativo && aplicar(r),
        (e) => ativo && falhar(e),
      );
    void rodar();
    const intervalo = setInterval(() => void rodar(), INTERVALO_ATUALIZACAO_MS);
    const aoVoltarPraAba = () => {
      if (document.visibilityState === "visible") void rodar();
    };
    document.addEventListener("visibilitychange", aoVoltarPraAba);
    return () => {
      ativo = false;
      clearInterval(intervalo);
      document.removeEventListener("visibilitychange", aoVoltarPraAba);
    };
  }, [buscar, aplicar, falhar]);

  async function assumir(s: SolicitacaoResumoResponse) {
    setAssumindoId(s.id);
    try {
      await assumirSolicitacao(s.id, s.versao);
      toast.success(`Você assumiu ${s.protocolo}.`);
      navigate(`/painel/${s.id}`);
    } catch (e) {
      toast.error(
        e instanceof ApiError
          ? e.message
          : "Não foi possível assumir a solicitação.",
      );
      // Outra pessoa pode ter assumido antes: mostra a fila como está agora.
      void carregar();
    } finally {
      setAssumindoId(null);
    }
  }

  function totalDaAba(statuses: readonly string[]): number | null {
    if (!contagem) return null;
    return statuses.reduce(
      (soma, st) =>
        soma + (contagem.porStatus[st as keyof typeof contagem.porStatus] ?? 0),
      0,
    );
  }

  const filtrando = !!busca || minhas;

  return (
    <PageContainer>
      <PageHeader
        atual="Painel"
        titulo="Solicitações"
        descricao="Pedidos de autorização de viagem para conferência. Os em aberto aparecem por urgência: viagem mais próxima primeiro."
      />

      {/* A fila fica dentro do TabsContent: cada aba aponta (aria-controls)
          pro painel com o conteúdo dela. */}
      <Tabs
        value={aba.id}
        onValueChange={(id) => atualizarParams({ aba: id, pagina: null })}
        className="gap-0"
      >
        <div className="mb-6 grid gap-4">
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <TabsList className="w-max">
              {ABAS_PAINEL.map((a) => {
                const total = totalDaAba(a.statuses);
                return (
                  <TabsTrigger key={a.id} value={a.id} className="gap-1.5">
                    {a.rotulo}
                    {total !== null && (
                      <span className="rounded-full bg-background/70 px-1.5 text-xs tabular-nums text-muted-foreground">
                        {total}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="relative w-full sm:max-w-sm">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                type="search"
                aria-label="Buscar por protocolo ou nome"
                placeholder="Buscar por protocolo ou nome"
                className="pl-9"
                value={buscaDigitada}
                onChange={(e) => setBuscaDigitada(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="so-minhas"
                checked={minhas}
                onCheckedChange={(v) =>
                  atualizarParams({ minhas: v ? "1" : null, pagina: null })
                }
              />
              <Label htmlFor="so-minhas" className="font-normal">
                Só as minhas
                {contagem && (
                  <span className="text-muted-foreground">
                    ({contagem.minhasEmAberto} em aberto)
                  </span>
                )}
              </Label>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:ml-auto">
              {atualizadoEm && (
                <span>
                  Atualizado às{" "}
                  {atualizadoEm.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Atualizar a fila"
                onClick={() => void carregar()}
              >
                <RefreshCw className="size-4" aria-hidden />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value={aba.id}>
          {erro && (
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-destructive/40 p-4 text-sm">
              <p className="text-destructive">{erro}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void carregar()}
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {carregando && !dados ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy>
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-60 rounded-xl" />
              ))}
              <span className="sr-only">Carregando a fila…</span>
            </div>
          ) : dados && dados.content.length === 0 ? (
            <Empty className="border border-input bg-card/60">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Inbox aria-hidden />
                </EmptyMedia>
                <EmptyTitle className="text-base">
                  {filtrando
                    ? "Nenhum pedido encontrado"
                    : `Nada em "${aba.rotulo}"`}
                </EmptyTitle>
                <EmptyDescription>
                  {filtrando
                    ? 'Nenhum pedido desta aba corresponde aos filtros. Limpe a busca ou desligue "Só as minhas".'
                    : "Quando houver pedidos nesta etapa, eles aparecem aqui."}
                </EmptyDescription>
              </EmptyHeader>
              {filtrando && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBuscaDigitada("");
                    atualizarParams({
                      busca: null,
                      minhas: null,
                      pagina: null,
                    });
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </Empty>
          ) : (
            dados && (
              <>
                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {dados.content.map((s) => (
                    <li key={s.id} className="grid">
                      <CardSolicitacao
                        solicitacao={s}
                        meuId={usuario?.id}
                        onAssumir={assumir}
                        assumindo={assumindoId === s.id}
                      />
                    </li>
                  ))}
                </ul>

                {dados.totalPages > 1 && (
                  <nav
                    aria-label="Paginação"
                    className="mt-6 flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      Página {dados.number + 1} de {dados.totalPages} ·{" "}
                      {dados.totalElements} pedidos
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagina === 0}
                        onClick={() =>
                          atualizarParams({ pagina: String(pagina - 1) })
                        }
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagina + 1 >= dados.totalPages}
                        onClick={() =>
                          atualizarParams({ pagina: String(pagina + 1) })
                        }
                      >
                        Próxima
                      </Button>
                    </div>
                  </nav>
                )}
              </>
            )
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
