import type { TipoAnexo } from "@/lib/types";

export const TIPO_ANEXO_LABEL: Record<TipoAnexo, string> = {
  DOC_REQUERENTE: "Documento do requerente",
  DOC_MENOR: "Documento da criança/adolescente",
  DOC_ACOMPANHANTE: "Documento do acompanhante",
  COMPROVANTE_RESIDENCIA: "Comprovante de residência",
  PASSAGEM: "Cópia da passagem",
  TERMO_GUARDA: "Termo de guarda/tutela",
  SELFIE_RG: "Selfie segurando o RG",
};

// Precisa bater com o limite do backend (application.yaml: max-file-size).
export const ANEXO_MAX_MB = 10;
export const ANEXO_ACCEPT = "application/pdf,image/jpeg,image/png";
export const ANEXO_DICA = "PDF, JPG ou PNG, até 10MB";

/** Valida no navegador antes de anexar, pra não estourar o limite do servidor. */
export function validarAnexo(arquivo: File): string | null {
  const tiposAceitos = ANEXO_ACCEPT.split(",");
  if (!tiposAceitos.includes(arquivo.type)) {
    return "Formato não aceito. Envie um arquivo em PDF, JPG ou PNG.";
  }
  if (arquivo.size > ANEXO_MAX_MB * 1024 * 1024) {
    return `Arquivo muito grande. O limite é ${ANEXO_MAX_MB}MB.`;
  }
  return null;
}

/**
 * Documentos que o analista espera encontrar num pedido — mesma lista que
 * a triagem pede ao cidadão. O que estiver faltando vira aviso no painel.
 */
export function anexosEsperados(s: {
  tipoResponsavel: string;
  tipoAutorizacao: string;
  responsavel: unknown;
}): TipoAnexo[] {
  const esperados: TipoAnexo[] = ["DOC_REQUERENTE", "DOC_MENOR", "COMPROVANTE_RESIDENCIA", "PASSAGEM"];
  if (s.tipoResponsavel === "TUTOR" || s.tipoResponsavel === "GUARDIAO") {
    esperados.push("TERMO_GUARDA");
  }
  if (s.tipoAutorizacao === "HOSPEDAGEM" && s.responsavel) {
    esperados.push("DOC_ACOMPANHANTE");
  }
  return esperados;
}
