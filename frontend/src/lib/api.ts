import type {
  AutorizacaoDocumentoResponse,
  ContagemPainelResponse,
  ConsultaProtocoloResponse,
  MudancaStatusRequest,
  Page,
  SolicitacaoRequest,
  SolicitacaoResponse,
  SolicitacaoResumoResponse,
  StatusSolicitacao,
  TipoAnexo,
  TriagemRequest,
  TriagemResultadoResponse,
} from "@/lib/types";
import { obterAccessToken, renovarTokens } from "@/lib/keycloak";

// Em dev, "/api" é redirecionado ao backend pelo proxy do Vite (vite.config.ts).
// Em produção, VITE_API_URL aponta direto para o domínio público do backend
// (frontend e backend são apps/domínios separados no Coolify).
const BASE = `${import.meta.env.VITE_API_URL ?? ""}/api`;

/** Erro com a mensagem vinda do ProblemDetail do backend, quando disponível. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const MENSAGEM_PADRAO: Record<number, string> = {
  401: "Sua sessão expirou. Entre novamente.",
  403: "Você não tem permissão para esta ação.",
};

async function parseError(res: Response): Promise<never> {
  let mensagem = MENSAGEM_PADRAO[res.status] ?? `Erro ${res.status}`;
  try {
    const body = await res.json();
    // ProblemDetail usa "detail"; validação adiciona "erros".
    mensagem = body.detail ?? body.message ?? mensagem;
  } catch {
    // corpo não-JSON: mantém a mensagem padrão
  }
  throw new ApiError(mensagem, res.status);
}

export async function criarSolicitacao(
  payload: SolicitacaoRequest,
): Promise<SolicitacaoResponse> {
  const res = await fetch(`${BASE}/solicitacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return parseError(res);
  return res.json();
}

export async function avaliarTriagem(
  payload: TriagemRequest,
): Promise<TriagemResultadoResponse> {
  const res = await fetch(`${BASE}/triagem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return parseError(res);
  return res.json();
}

export async function consultarPorProtocolo(
  protocolo: string,
): Promise<ConsultaProtocoloResponse> {
  const res = await fetch(
    `${BASE}/solicitacoes/protocolo/${encodeURIComponent(protocolo)}`,
  );
  if (!res.ok) return parseError(res);
  return res.json();
}

export async function enviarAnexoPorProtocolo(
  protocolo: string,
  tipo: TipoAnexo,
  arquivo: File,
): Promise<ConsultaProtocoloResponse> {
  const form = new FormData();
  form.append("tipo", tipo);
  form.append("arquivo", arquivo);
  const res = await fetch(
    `${BASE}/solicitacoes/protocolo/${encodeURIComponent(protocolo)}/anexos`,
    { method: "POST", body: form },
  );
  if (!res.ok) return parseError(res);
  return res.json();
}

/** URL pra visualizar/baixar o binário de um anexo. */
export function anexoUrl(id: number): string {
  return `${BASE}/anexos/${id}`;
}

export async function buscarAutorizacao(
  protocolo: string,
): Promise<AutorizacaoDocumentoResponse> {
  const res = await fetch(
    `${BASE}/solicitacoes/protocolo/${encodeURIComponent(protocolo)}/autorizacao`,
  );
  if (!res.ok) return parseError(res);
  return res.json();
}

// --- Painel interno (analista) ---
// Exigem o token do Keycloak (role ANALISTA ou ADMIN).

function comToken(init: RequestInit, token: string | null): RequestInit {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return { ...init, headers };
}

/** fetch autenticado: renova o token se preciso e repete uma vez em caso de 401. */
async function authFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, comToken(init, await obterAccessToken()));
  if (res.status !== 401) return res;
  const novoToken = await renovarTokens();
  return novoToken ? fetch(url, comToken(init, novoToken)) : res;
}

export interface FiltroPainel {
  /** Vazio = todos os status. */
  statuses: StatusSolicitacao[];
  busca?: string;
  /** Só os pedidos em que o analista logado é o responsável. */
  minhas?: boolean;
  page: number;
}

export async function listarSolicitacoes(
  filtro: FiltroPainel,
): Promise<Page<SolicitacaoResumoResponse>> {
  const params = new URLSearchParams({ page: String(filtro.page), size: "24" });
  filtro.statuses.forEach((s) => params.append("status", s));
  if (filtro.busca?.trim()) params.set("busca", filtro.busca.trim());
  if (filtro.minhas) params.set("minhas", "true");
  const res = await authFetch(`${BASE}/analista/solicitacoes?${params}`);
  if (!res.ok) return parseError(res);
  return res.json();
}

export async function contarSolicitacoes(): Promise<ContagemPainelResponse> {
  const res = await authFetch(`${BASE}/analista/solicitacoes/contagem`);
  if (!res.ok) return parseError(res);
  return res.json();
}

/** O analista logado assume o pedido (Recebida → Em análise). */
export async function assumirSolicitacao(
  id: number,
  versao: number,
): Promise<SolicitacaoResponse> {
  const res = await authFetch(`${BASE}/analista/solicitacoes/${id}/assumir`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ versao }),
  });
  if (!res.ok) return parseError(res);
  return res.json();
}

export async function detalharSolicitacao(id: number): Promise<SolicitacaoResponse> {
  const res = await authFetch(`${BASE}/analista/solicitacoes/${id}`);
  if (!res.ok) return parseError(res);
  return res.json();
}

export async function mudarStatusSolicitacao(
  id: number,
  payload: MudancaStatusRequest,
): Promise<SolicitacaoResponse> {
  const res = await authFetch(`${BASE}/analista/solicitacoes/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return parseError(res);
  return res.json();
}
