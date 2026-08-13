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
