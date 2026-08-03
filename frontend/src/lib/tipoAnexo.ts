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
