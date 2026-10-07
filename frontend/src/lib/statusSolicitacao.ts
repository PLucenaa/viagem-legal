import type { StatusSolicitacao } from "@/lib/types";

export const STATUS_LABEL: Record<StatusSolicitacao, string> = {
  RECEBIDA: "Recebida",
  EM_ANALISE: "Em análise",
  PENDENTE_CORRECAO: "Pendente de correção",
  DEFERIDA: "Deferida",
  INDEFERIDA: "Indeferida",
  AGUARDANDO_ASSINATURA: "Aguardando assinatura",
  CONCLUIDA: "Concluída",
};

export const STATUS_BADGE_VARIANT: Record<
  StatusSolicitacao,
  "default" | "secondary" | "destructive" | "outline"
> = {
  RECEBIDA: "secondary",
  EM_ANALISE: "default",
  PENDENTE_CORRECAO: "outline",
  DEFERIDA: "default",
  INDEFERIDA: "destructive",
  AGUARDANDO_ASSINATURA: "outline",
  CONCLUIDA: "secondary",
};

/** Espelha TransicaoStatus.java — só pra UX (a validação real é no backend). */
export const TRANSICOES_PERMITIDAS: Record<StatusSolicitacao, StatusSolicitacao[]> = {
  RECEBIDA: ["EM_ANALISE"],
  EM_ANALISE: ["PENDENTE_CORRECAO", "DEFERIDA", "INDEFERIDA"],
  PENDENTE_CORRECAO: ["EM_ANALISE"],
  DEFERIDA: ["AGUARDANDO_ASSINATURA"],
  AGUARDANDO_ASSINATURA: ["CONCLUIDA"],
  INDEFERIDA: [],
  CONCLUIDA: [],
};

/** Observação é obrigatória nessas transições (regra do backend). */
export function observacaoObrigatoria(novoStatus: StatusSolicitacao): boolean {
  return novoStatus === "INDEFERIDA" || novoStatus === "PENDENTE_CORRECAO";
}

/** Abas do painel: cada uma é um recorte da fila por status. */
export interface AbaPainel {
  id: string;
  rotulo: string;
  statuses: StatusSolicitacao[];
}

export const ABAS_PAINEL: AbaPainel[] = [
  {
    id: "aberto",
    rotulo: "Em aberto",
    statuses: ["RECEBIDA", "EM_ANALISE", "PENDENTE_CORRECAO", "DEFERIDA", "AGUARDANDO_ASSINATURA"],
  },
  { id: "recebidas", rotulo: "Recebidas", statuses: ["RECEBIDA"] },
  { id: "analise", rotulo: "Em análise", statuses: ["EM_ANALISE"] },
  { id: "correcao", rotulo: "Aguardando correção", statuses: ["PENDENTE_CORRECAO"] },
  { id: "assinatura", rotulo: "Para assinar", statuses: ["DEFERIDA", "AGUARDANDO_ASSINATURA"] },
  { id: "finalizadas", rotulo: "Finalizadas", statuses: ["CONCLUIDA", "INDEFERIDA"] },
];

/** Status em que o pedido ainda pode ser assumido/trabalhado. */
export function emAberto(status: StatusSolicitacao): boolean {
  return ABAS_PAINEL[0].statuses.includes(status);
}
