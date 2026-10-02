import { Link } from "react-router-dom";
import { CalendarClock, MapPin, Paperclip, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { emAberto, STATUS_BADGE_VARIANT, STATUS_LABEL } from "@/lib/statusSolicitacao";
import { haQuantoTempo, urgenciaDaViagem, type NivelUrgencia } from "@/lib/urgencia";
import type { SolicitacaoResumoResponse, TipoAutorizacao } from "@/lib/types";
import { cn } from "@/lib/utils";

const TIPO_LABEL: Record<TipoAutorizacao, string> = {
  NACIONAL: "Viagem nacional",
  INTERNACIONAL: "Viagem internacional",
  HOSPEDAGEM: "Hospedagem",
};

const ESTILO_URGENCIA: Record<NivelUrgencia, string> = {
  critica: "bg-estrada text-paper",
  alta: "bg-lavrado/25 text-ink ring-1 ring-lavrado",
  normal: "bg-muted text-muted-foreground",
  passou: "text-estrada ring-1 ring-estrada/50",
};

interface CardSolicitacaoProps {
  solicitacao: SolicitacaoResumoResponse;
  /** "sub" do analista logado, pra saber se o pedido é dele. */
  meuId?: string;
  onAssumir: (solicitacao: SolicitacaoResumoResponse) => void;
  assumindo: boolean;
}

export function CardSolicitacao({
  solicitacao: s,
  meuId,
  onAssumir,
  assumindo,
}: CardSolicitacaoProps) {
  const aberto = emAberto(s.status);
  // Urgência só importa enquanto há trabalho a fazer.
  const urgencia = aberto ? urgenciaDaViagem(s.dataIda) : null;
  const ehMeu = !!meuId && s.analistaId === meuId;
  const semResponsavel = !s.analistaId;
  const titulo = s.menorNome ?? "Criança/adolescente não informado";

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="gap-3 px-5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground tabular-nums">{s.protocolo}</span>
          <Badge variant={STATUS_BADGE_VARIANT[s.status]}>{STATUS_LABEL[s.status]}</Badge>
        </div>
        <div className="grid gap-1">
          <h2 className="font-display text-lg leading-tight font-semibold text-balance">
            <Link
              to={`/painel/${s.id}`}
              className="rounded-sm outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {titulo}
            </Link>
          </h2>
          <p className="text-sm text-muted-foreground">
            Requerente: {s.requerenteNome ?? "não informado"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="grid gap-2 px-5 text-sm">
        <p className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden />
          <span className="truncate">
            {TIPO_LABEL[s.tipoAutorizacao]}
            {s.destino ? ` · ${s.destino}` : ""}
          </span>
        </p>
        {urgencia ? (
          <p
            className={cn(
              "flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
              ESTILO_URGENCIA[urgencia.nivel],
            )}
          >
            <CalendarClock className="size-3.5" aria-hidden />
            {urgencia.texto}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Recebida {haQuantoTempo(s.criadoEm)}
          </p>
        )}
      </CardContent>

      <CardFooter className="mt-auto flex-wrap items-center justify-between gap-3 border-t px-5 pt-4">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <UserRound className="size-3.5" aria-hidden />
            {semResponsavel ? "Sem responsável" : ehMeu ? "Com você" : `Com ${s.analistaNome}`}
          </span>
          <span className="flex items-center gap-1">
            <Paperclip className="size-3.5" aria-hidden />
            {s.quantidadeAnexos === 1 ? "1 documento" : `${s.quantidadeAnexos} documentos`}
          </span>
        </div>
        {aberto && semResponsavel ? (
          <Button
            size="sm"
            disabled={assumindo}
            onClick={() => onAssumir(s)}
            aria-label={`Assumir solicitação ${s.protocolo}`}
          >
            {assumindo ? "Assumindo…" : "Assumir"}
          </Button>
        ) : (
          <Button asChild size="sm" variant="outline">
            <Link to={`/painel/${s.id}`} aria-label={`Abrir solicitação ${s.protocolo}`}>
              Abrir
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
