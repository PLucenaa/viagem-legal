import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CalendarClock, MapPin } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { DecisaoPainel } from "@/components/painel/DecisaoPainel";
import { DocumentosPainel } from "@/components/painel/DocumentosPainel";
import { HistoricoPainel } from "@/components/painel/HistoricoPainel";
import { Dado, SecaoDados } from "@/components/painel/SecaoDados";
import { ApiError, detalharSolicitacao, listarSolicitacoes } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  formatarCpf,
  formatarData,
  formatarDocumento,
  formatarEndereco,
  formatarTelefone,
  idadeEmAnos,
  TIPO_AUTORIZACAO_LABEL,
  TIPO_RESPONSAVEL_LABEL,
} from "@/lib/rotulos";
import { ABAS_PAINEL, emAberto, STATUS_BADGE_VARIANT, STATUS_LABEL } from "@/lib/statusSolicitacao";
import { haQuantoTempo, urgenciaDaViagem } from "@/lib/urgencia";
import type { SolicitacaoResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PainelDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [solicitacao, setSolicitacao] = useState<SolicitacaoResponse | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [buscandoProxima, setBuscandoProxima] = useState(false);

  const carregar = useCallback(
    () =>
      detalharSolicitacao(Number(id)).then(
        (res) => {
          setSolicitacao(res);
          setErro(null);
        },
        (e) =>
          setErro(e instanceof ApiError ? e.message : "Não foi possível carregar a solicitação."),
      ),
    [id],
  );

  useEffect(() => {
    let ativo = true;
    detalharSolicitacao(Number(id)).then(
      (res) => {
        if (!ativo) return;
        setSolicitacao(res);
        setErro(null);
      },
      (e) => {
        if (ativo) {
          setErro(e instanceof ApiError ? e.message : "Não foi possível carregar a solicitação.");
        }
      },
    );
    return () => {
      ativo = false;
    };
  }, [id]);

  /**
   * Próximo pedido a trabalhar: primeiro os em aberto que já são do analista,
   * depois os recebidos sem responsável — sempre pela ordem de urgência da fila.
   */
  async function irParaProxima() {
    setBuscandoProxima(true);
    try {
      const atual = Number(id);
      const minhas = await listarSolicitacoes({ statuses: ABAS_PAINEL[0].statuses, minhas: true, page: 0 });
      let proxima = minhas.content.find((s) => s.id !== atual && s.status !== "PENDENTE_CORRECAO");
      if (!proxima) {
        const novas = await listarSolicitacoes({ statuses: ["RECEBIDA"], page: 0 });
        proxima = novas.content.find((s) => s.id !== atual);
      }
      if (proxima) {
        navigate(`/painel/${proxima.id}`);
      } else {
        toast.success("Fila em dia: não há outro pedido esperando por você.");
        navigate("/painel");
      }
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Não foi possível buscar o próximo pedido.");
    } finally {
      setBuscandoProxima(false);
    }
  }

  if (erro) {
    return (
      <PageContainer>
        <PageHeader trilha={[{ rotulo: "Painel", to: "/painel" }]} atual="Pedido" titulo="Pedido" />
        <p className="text-sm text-destructive">{erro}</p>
        <Button asChild variant="outline" className="mt-4 gap-2">
          <Link to="/painel">
            <ArrowLeft className="size-4" aria-hidden /> Voltar para a fila
          </Link>
        </Button>
      </PageContainer>
    );
  }

  // Trocou de pedido (próxima da fila) e o novo ainda não chegou.
  if (!solicitacao || solicitacao.id !== Number(id)) {
    return (
      <PageContainer>
        <div className="grid gap-6 lg:grid-cols-[1fr_24rem]" aria-busy>
          <div className="grid gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
          <Skeleton className="h-80 rounded-xl" />
          <span className="sr-only">Carregando o pedido…</span>
        </div>
      </PageContainer>
    );
  }

  const s = solicitacao;
  const urgencia = emAberto(s.status) ? urgenciaDaViagem(s.dadosViagem.dataIda) : null;
  const idade = s.menor.dataNascimento ? idadeEmAnos(s.menor.dataNascimento) : null;

  return (
    <PageContainer>
      <PageHeader
        trilha={[{ rotulo: "Painel", to: "/painel" }]}
        atual={s.protocolo}
        titulo={<span className="tabular-nums">{s.protocolo}</span>}
      >
        <Badge variant={STATUS_BADGE_VARIANT[s.status]}>{STATUS_LABEL[s.status]}</Badge>
      </PageHeader>

      {/* minmax(0, 1fr): sem isso, um texto longo (nome de arquivo) alarga a
          coluna além da tela no celular. */}
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        {/* Resumo: quem viaja, pra onde e quando — o que decide a prioridade. */}
        <Card className="py-5 lg:col-start-1">
          <CardContent className="grid gap-3 px-5 sm:px-6">
            <div className="grid gap-1">
              <h2 className="font-display text-2xl leading-tight font-semibold text-balance">
                {s.menor.nomeCompleto}
              </h2>
              <p className="text-sm text-muted-foreground">
                {idade !== null && `${idade} ${idade === 1 ? "ano" : "anos"} · `}
                Pedido de {TIPO_RESPONSAVEL_LABEL[s.tipoResponsavel].toLowerCase()},{" "}
                {s.requerente.nomeCompleto} · recebido {haQuantoTempo(s.criadoEm)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-muted-foreground" aria-hidden />
                {TIPO_AUTORIZACAO_LABEL[s.tipoAutorizacao]} · {s.dadosViagem.destino}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarClock className="size-4 text-muted-foreground" aria-hidden />
                {formatarData(s.dadosViagem.dataIda)}
                {s.dadosViagem.dataVolta && ` a ${formatarData(s.dadosViagem.dataVolta)}`}
              </span>
              {urgencia && urgencia.nivel !== "normal" && (
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    urgencia.nivel === "critica" && "bg-estrada text-paper",
                    urgencia.nivel === "alta" && "bg-lavrado/25 text-ink ring-1 ring-lavrado",
                    urgencia.nivel === "passou" && "text-estrada ring-1 ring-estrada/50",
                  )}
                >
                  {urgencia.texto}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Coluna da decisão: fixa ao rolar no desktop; no celular vem logo
            depois do resumo, antes dos dados. O histórico fica embaixo da
            decisão no desktop e no fim da página no celular. */}
        <aside
          aria-label="Decisão e histórico"
          className="grid gap-6 lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1"
        >
          <DecisaoPainel
            key={s.id}
            solicitacao={s}
            meuId={usuario?.id}
            onAtualizada={setSolicitacao}
            onConflito={() => void carregar()}
            onProxima={irParaProxima}
            buscandoProxima={buscandoProxima}
          />
          <div className="hidden lg:grid">
            <HistoricoPainel historico={s.historico} />
          </div>
        </aside>

        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:col-start-1">
          <DocumentosPainel solicitacao={s} />

          <SecaoDados titulo="Requerente">
            <Dado rotulo="Nome" valor={s.requerente.nomeCompleto} />
            <Dado rotulo="Qualidade" valor={TIPO_RESPONSAVEL_LABEL[s.tipoResponsavel]} />
            <Dado rotulo="CPF" valor={formatarCpf(s.requerente.cpf)} />
            <Dado
              rotulo="Documento"
              valor={formatarDocumento(
                s.requerente.tipoDocumento,
                s.requerente.numeroDocumento,
                s.requerente.orgaoExpedidor,
              )}
            />
            <Dado rotulo="Telefone" valor={formatarTelefone(s.requerente.telefone)} />
            <Dado rotulo="E-mail" valor={s.requerente.email} />
            <Dado rotulo="Profissão" valor={s.requerente.profissao} />
            <Dado rotulo="Endereço" valor={formatarEndereco(s.requerente.endereco)} largo />
          </SecaoDados>

          <SecaoDados titulo="Criança ou adolescente">
            <Dado rotulo="Nome" valor={s.menor.nomeCompleto} />
            <Dado
              rotulo="Data de nascimento"
              valor={
                s.menor.dataNascimento &&
                `${formatarData(s.menor.dataNascimento)}${idade !== null ? ` (${idade} ${idade === 1 ? "ano" : "anos"})` : ""}`
              }
            />
            <Dado rotulo="Naturalidade" valor={s.menor.naturalidade} />
            <Dado
              rotulo="Documento"
              valor={formatarDocumento(s.menor.tipoDocumento, s.menor.numeroDocumento, s.menor.orgaoExpedidor)}
            />
          </SecaoDados>

          {s.responsavel?.nomeCompleto && (
            <SecaoDados titulo="Responsável pela hospedagem">
              <Dado rotulo="Nome" valor={s.responsavel.nomeCompleto} />
              <Dado rotulo="CPF" valor={formatarCpf(s.responsavel.cpf)} />
              <Dado
                rotulo="Documento"
                valor={formatarDocumento(
                  s.responsavel.tipoDocumento,
                  s.responsavel.numeroDocumento,
                  s.responsavel.orgaoExpedidor,
                )}
              />
              <Dado rotulo="Telefone" valor={formatarTelefone(s.responsavel.telefone)} />
            </SecaoDados>
          )}

          <SecaoDados titulo="Viagem">
            <Dado rotulo="Tipo" valor={TIPO_AUTORIZACAO_LABEL[s.tipoAutorizacao]} />
            <Dado rotulo="Destino" valor={s.dadosViagem.destino} />
            <Dado rotulo="Ida" valor={formatarData(s.dadosViagem.dataIda)} />
            <Dado rotulo="Volta" valor={formatarData(s.dadosViagem.dataVolta)} />
            <Dado rotulo="Meio de transporte" valor={s.dadosViagem.meioTransporte} />
            <Dado
              rotulo="Validade da autorização"
              valor={s.dadosViagem.validadeDias ? `${s.dadosViagem.validadeDias} dias` : undefined}
            />
          </SecaoDados>

          <div className="grid lg:hidden">
            <HistoricoPainel historico={s.historico} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
