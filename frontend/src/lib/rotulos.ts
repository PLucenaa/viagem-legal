// Rótulos legíveis dos enums da API e formatadores de exibição — num lugar
// só, pra fila, detalhe e formulários falarem a mesma língua.

import { mascaraCpf, mascaraTelefone, soDigitos } from "@/lib/mascaras";
import type {
  EnderecoRequest,
  TipoAutorizacao,
  TipoDocumento,
  TipoResponsavel,
} from "@/lib/types";

export const TIPO_AUTORIZACAO_LABEL: Record<TipoAutorizacao, string> = {
  NACIONAL: "Viagem nacional",
  INTERNACIONAL: "Viagem internacional",
  HOSPEDAGEM: "Hospedagem",
};

export const TIPO_RESPONSAVEL_LABEL: Record<TipoResponsavel, string> = {
  MAE: "Mãe",
  PAI: "Pai",
  TUTOR: "Tutor(a)",
  GUARDIAO: "Guardião(ã)",
};

export const TIPO_DOCUMENTO_LABEL: Record<TipoDocumento, string> = {
  RG: "RG",
  CNH: "CNH",
  PASSAPORTE: "Passaporte",
  CERTIDAO_NASCIMENTO: "Certidão de nascimento",
};

/** "2026-08-15" → "15/08/2026" (data sem fuso; não passa por Date). */
export function formatarData(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const [ano, mes, dia] = iso.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

/** Instante ISO → "15/08/2026 às 14:32". */
export function formatarDataHora(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR")} às ${d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

/** Idade em anos completos numa data de referência (hoje, por padrão). */
export function idadeEmAnos(nascimentoIso: string, referencia = new Date()): number {
  const [ano, mes, dia] = nascimentoIso.split("-").map(Number);
  let idade = referencia.getFullYear() - ano;
  const aindaNaoFez =
    referencia.getMonth() + 1 < mes ||
    (referencia.getMonth() + 1 === mes && referencia.getDate() < dia);
  if (aindaNaoFez) idade -= 1;
  return idade;
}

/**
 * CPF/telefone formatados. Pedidos antigos (antes das máscaras) vieram só
 * com dígitos; os novos já vêm formatados — a máscara serve pros dois.
 */
export function formatarCpf(cpf?: string | null): string | undefined {
  if (!cpf) return undefined;
  return soDigitos(cpf).length === 11 ? mascaraCpf(cpf) : cpf;
}

export function formatarTelefone(tel?: string | null): string | undefined {
  if (!tel) return undefined;
  const n = soDigitos(tel).length;
  return n === 10 || n === 11 ? mascaraTelefone(tel) : tel;
}

/** "RG 1234567 · SSP/RR" */
export function formatarDocumento(
  tipo?: TipoDocumento | null,
  numero?: string | null,
  orgao?: string | null,
): string | undefined {
  if (!numero) return undefined;
  const base = tipo ? `${TIPO_DOCUMENTO_LABEL[tipo]} ${numero}` : numero;
  return orgao ? `${base} · ${orgao}` : base;
}

/** "Rua X, 123, Centro — Boa Vista/RR · CEP 69301-000" */
export function formatarEndereco(e?: EnderecoRequest | null): string | undefined {
  if (!e?.logradouro) return undefined;
  const rua = [e.logradouro, e.numero, e.complemento, e.bairro].filter(Boolean).join(", ");
  const cidade = [e.cidade, e.uf].filter(Boolean).join("/");
  return `${rua} — ${cidade}${e.cep ? ` · CEP ${e.cep}` : ""}`;
}
