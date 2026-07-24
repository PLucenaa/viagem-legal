import { z } from "zod";

const tipoDocumento = z.enum(["RG", "CNH", "PASSAPORTE", "CERTIDAO_NASCIMENTO"]);

const enderecoSchema = z.object({
  logradouro: z.string().min(1, "Informe o logradouro"),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Informe o bairro"),
  cidade: z.string().min(1, "Informe a cidade"),
  uf: z.string().min(1, "UF"),
  cep: z.string().min(1, "Informe o CEP"),
});

const requerenteSchema = z.object({
  nomeCompleto: z.string().min(1, "Informe o nome do responsável"),
  cpf: z.string().min(1, "Informe o CPF"),
  nacionalidade: z.string().optional(),
  estadoCivil: z.string().optional(),
  profissao: z.string().optional(),
  tipoDocumento: tipoDocumento,
  numeroDocumento: z.string().min(1, "Informe o número do documento"),
  orgaoExpedidor: z.string().optional(),
  telefone: z.string().min(1, "Informe o telefone"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  endereco: enderecoSchema,
});

const menorSchema = z.object({
  nomeCompleto: z.string().min(1, "Informe o nome do menor"),
  dataNascimento: z.string().min(1, "Informe a data de nascimento"),
  sexo: z.enum(["MASCULINO", "FEMININO"]).optional(),
  naturalidade: z.string().optional(),
  tipoDocumento: tipoDocumento,
  numeroDocumento: z.string().min(1, "Informe o número do documento"),
});

const responsavelSchema = z.object({
  nomeCompleto: z.string().optional(),
  cpf: z.string().optional(),
  numeroDocumento: z.string().optional(),
  grauParentesco: z.string().optional(),
});

const dadosViagemSchema = z.object({
  destino: z.string().min(1, "Informe o destino"),
  dataIda: z.string().min(1, "Informe a data de ida"),
  dataVolta: z.string().optional(),
  meioTransporte: z.string().optional(),
  validadeDias: z.string().optional(),
});

export const solicitacaoSchema = z
  .object({
    tipoAutorizacao: z.enum(["NACIONAL", "INTERNACIONAL", "HOSPEDAGEM"]),
    tipoResponsavel: z.enum(["PAI", "MAE", "TUTOR", "GUARDIAO"]),
    requerente: requerenteSchema,
    menor: menorSchema,
    responsavel: responsavelSchema,
    dadosViagem: dadosViagemSchema,
  })
  .superRefine((data, ctx) => {
    // Regra: hospedagem exige responsável e prazo de validade.
    if (data.tipoAutorizacao === "HOSPEDAGEM") {
      if (!data.responsavel.nomeCompleto) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hospedagem exige o nome do responsável pela hospedagem",
          path: ["responsavel", "nomeCompleto"],
        });
      }
      if (!data.dadosViagem.validadeDias) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe a validade em dias",
          path: ["dadosViagem", "validadeDias"],
        });
      }
    }
  });

export type SolicitacaoFormValues = z.infer<typeof solicitacaoSchema>;
