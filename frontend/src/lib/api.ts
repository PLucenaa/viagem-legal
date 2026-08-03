import type {
  AutorizacaoDocumentoResponse,
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

async function parseError(res: Response): Promise<never> {
  let mensagem = `Erro ${res.status}`;
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
// Endpoints ainda sem autenticação (Keycloak a integrar depois).

export async function listarSolicitacoes(
  status: StatusSolicitacao | undefined,
  page: number,
): Promise<Page<SolicitacaoResumoResponse>> {
  const params = new URLSearchParams({ page: String(page), size: "20" });
  if (status) params.set("status", status);
  const res = await fetch(`${BASE}/analista/solicitacoes?${params}`);
  if (!res.ok) return parseError(res);
  return res.json();
}

export async function detalharSolicitacao(id: number): Promise<SolicitacaoResponse> {
  const res = await fetch(`${BASE}/analista/solicitacoes/${id}`);
  if (!res.ok) return parseError(res);
  return res.json();
}

export async function mudarStatusSolicitacao(
  id: number,
  payload: MudancaStatusRequest,
): Promise<SolicitacaoResponse> {
  const res = await fetch(`${BASE}/analista/solicitacoes/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return parseError(res);
  return res.json();
}
