import type {
  ConsultaProtocoloResponse,
  SolicitacaoRequest,
  SolicitacaoResponse,
  TriagemRequest,
  TriagemResultadoResponse,
} from "@/lib/types";

// As chamadas vão para /api (o Vite faz proxy para o backend Spring em dev).
const BASE = "/api";

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
