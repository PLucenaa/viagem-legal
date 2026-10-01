import { useState, type ComponentProps } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type FieldPath, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageContainer } from "@/components/layout/PageContainer";
import { Campo } from "@/components/form/Campo";
import { UploadArquivo } from "@/components/form/UploadArquivo";
import { InputMascara } from "@/components/form/InputMascara";
import { OpcoesRadio, type OpcaoRadio } from "@/components/form/OpcoesRadio";
import { criarSolicitacao, enviarAnexoPorProtocolo } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { buscarCep } from "@/lib/cep";
import {
  cepValido,
  mascaraCep,
  mascaraCpf,
  mascaraNumero,
  mascaraTelefone,
  mascaraUf,
} from "@/lib/mascaras";
import {
  solicitacaoSchema,
  type SolicitacaoFormValues,
} from "@/lib/solicitacaoSchema";
import { TIPO_ANEXO_LABEL } from "@/lib/tipoAnexo";
import type { SolicitacaoRequest, TipoAnexo } from "@/lib/types";

type Valores = SolicitacaoFormValues;
type Campos = FieldPath<Valores>;

const TIPOS_AUTORIZACAO: OpcaoRadio<Valores["tipoAutorizacao"]>[] = [
  { valor: "NACIONAL", rotulo: "Viagem nacional", descricao: "Dentro do Brasil" },
  { valor: "INTERNACIONAL", rotulo: "Viagem internacional", descricao: "Para fora do país" },
  { valor: "HOSPEDAGEM", rotulo: "Hospedagem", descricao: "Hotel, pousada ou similar" },
];

const TIPOS_RESPONSAVEL: OpcaoRadio<Valores["tipoResponsavel"]>[] = [
  { valor: "MAE", rotulo: "Mãe" },
  { valor: "PAI", rotulo: "Pai" },
  { valor: "TUTOR", rotulo: "Tutor(a)" },
  { valor: "GUARDIAO", rotulo: "Guardião(ã)" },
];

const DOCS: OpcaoRadio<Valores["menor"]["tipoDocumento"]>[] = [
  { valor: "RG", rotulo: "RG" },
  { valor: "CNH", rotulo: "CNH" },
  { valor: "PASSAPORTE", rotulo: "Passaporte" },
  { valor: "CERTIDAO_NASCIMENTO", rotulo: "Certidão de nascimento" },
];

interface DocumentoStaged {
  tipo: TipoAnexo;
  arquivo: File;
}

// Tipos de documento já anexados dentro da própria seção do formulário —
// não aparecem de novo na lista genérica de "Documentos" lá embaixo.
const TIPOS_INLINE: TipoAnexo[] = [
  "DOC_REQUERENTE",
  "COMPROVANTE_RESIDENCIA",
  "DOC_MENOR",
  "PASSAGEM",
];

// Tipos que sobram pra seção genérica "Documentos" (todos, menos os inline).
const TIPOS_EXTRAS = (Object.keys(TIPO_ANEXO_LABEL) as TipoAnexo[]).filter(
  (t) => !TIPOS_INLINE.includes(t),
);

export function SolicitarPage() {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [documentos, setDocumentos] = useState<DocumentoStaged[]>([]);
  const [tipoStaging, setTipoStaging] = useState<TipoAnexo>(TIPOS_EXTRAS[0]);
  const [buscandoCep, setBuscandoCep] = useState(false);

  const form = useForm<SolicitacaoFormValues>({
    resolver: zodResolver(solicitacaoSchema),
    defaultValues: {
      tipoAutorizacao: "NACIONAL",
      tipoResponsavel: "MAE",
      requerente: {
        nomeCompleto: "",
        cpf: "",
        tipoDocumento: "RG",
        numeroDocumento: "",
        telefone: "",
        email: "",
        endereco: {
          logradouro: "",
          bairro: "",
          cidade: "Boa Vista",
          uf: "RR",
          cep: "",
        },
      },
      menor: {
        nomeCompleto: "",
        dataNascimento: "",
        tipoDocumento: "CERTIDAO_NASCIMENTO",
        numeroDocumento: "",
      },
      responsavel: {},
      dadosViagem: { destino: "", dataIda: "" },
    },
  });

  const tipoAutorizacao = form.watch("tipoAutorizacao");
  const ehHospedagem = tipoAutorizacao === "HOSPEDAGEM";
  const documentosExtras = documentos.filter((d) => !TIPOS_INLINE.includes(d.tipo));

  async function preencherEnderecoPorCep(cepDigitado: string) {
    setBuscandoCep(true);
    try {
      const endereco = await buscarCep(cepDigitado);
      if (!endereco) {
        toast.error("CEP não encontrado. Preencha o endereço manualmente.");
        return;
      }
      form.setValue("requerente.endereco.logradouro", endereco.logradouro, {
        shouldValidate: true,
      });
      form.setValue("requerente.endereco.bairro", endereco.bairro, {
        shouldValidate: true,
      });
      form.setValue("requerente.endereco.cidade", endereco.localidade, {
        shouldValidate: true,
      });
      form.setValue("requerente.endereco.uf", endereco.uf, {
        shouldValidate: true,
      });
    } finally {
      setBuscandoCep(false);
    }
  }

  async function onSubmit(values: SolicitacaoFormValues) {
    setEnviando(true);
    try {
      const payload: SolicitacaoRequest = {
        ...values,
        requerente: {
          ...values.requerente,
          email: values.requerente.email || undefined,
        },
        responsavel: values.responsavel.nomeCompleto
          ? values.responsavel
          : undefined,
        dadosViagem: {
          ...values.dadosViagem,
          validadeDias: values.dadosViagem.validadeDias
            ? Number(values.dadosViagem.validadeDias)
            : undefined,
        },
      };
      const resposta = await criarSolicitacao(payload);

      for (const doc of documentos) {
        try {
          await enviarAnexoPorProtocolo(resposta.protocolo, doc.tipo, doc.arquivo);
        } catch {
          toast.error(
            `Solicitação criada, mas falhou o envio de "${doc.arquivo.name}". Envie de novo pela tela de acompanhamento.`,
          );
        }
      }

      toast.success(`Solicitação criada! Protocolo ${resposta.protocolo}`);
      navigate(`/acompanhar?protocolo=${resposta.protocolo}`);
    } catch (e) {
      const msg =
        e instanceof ApiError ? e.message : "Falha ao enviar a solicitação.";
      toast.error(msg);
    } finally {
      setEnviando(false);
    }
  }

  function adicionarDocumento(arquivo: File) {
    setDocumentos((docs) => [...docs, { tipo: tipoStaging, arquivo }]);
  }

  function removerDocumento(alvo: DocumentoStaged) {
    setDocumentos((docs) => docs.filter((d) => d !== alvo));
  }

  // Documentos "amarrados" a uma seção específica (menor, viagem...) — no
  // máximo um arquivo por tipo, substitui se anexar de novo.
  function anexarTipoFixo(tipo: TipoAnexo, arquivo: File) {
    setDocumentos((docs) => [...docs.filter((d) => d.tipo !== tipo), { tipo, arquivo }]);
  }

  function removerTipoFixo(tipo: TipoAnexo) {
    setDocumentos((docs) => docs.filter((d) => d.tipo !== tipo));
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <Button asChild variant="link" size="sm" className="px-0">
          <Link to="/">← Voltar</Link>
        </Button>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Solicitar autorização
        </h1>
        <p className="text-sm text-muted-foreground">
          Atendimento exclusivo para residentes em Boa Vista/RR.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Tipo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tipo de autorização</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <RadioField
                form={form}
                name="tipoAutorizacao"
                label="Autorização"
                opcoes={TIPOS_AUTORIZACAO}
                className="grid-cols-1 sm:grid-cols-3"
              />
              <RadioField
                form={form}
                name="tipoResponsavel"
                label="Você é"
                opcoes={TIPOS_RESPONSAVEL}
                className="sm:grid-cols-4"
              />
            </CardContent>
          </Card>

          {/* Requerente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados do responsável</CardTitle>
            </CardHeader>
            <CardContent className={GRADE}>
              <TextField form={form} name="requerente.nomeCompleto" label="Nome completo" className="sm:col-span-2" autoComplete="name" />
              <TextField form={form} name="requerente.cpf" label="CPF" mascara={mascaraCpf} inputMode="numeric" placeholder="000.000.000-00" />
              <TextField form={form} name="requerente.telefone" label="Telefone" mascara={mascaraTelefone} inputMode="tel" placeholder="(95) 99999-9999" autoComplete="tel" />
              <RadioField form={form} name="requerente.tipoDocumento" label="Documento de identificação" opcoes={DOCS} className="sm:grid-cols-4" wrapperClassName="sm:col-span-2" />
              <TextField form={form} name="requerente.numeroDocumento" label="Nº do documento" />
              <TextField form={form} name="requerente.orgaoExpedidor" label="Órgão expedidor (opcional)" placeholder="Ex.: SSP/RR" />
              <TextField form={form} name="requerente.email" label="E-mail (opcional)" type="email" autoComplete="email" />
              <TextField form={form} name="requerente.profissao" label="Profissão (opcional)" />
              <DocumentoInline
                tipo="DOC_REQUERENTE"
                label="Foto/cópia do documento do responsável"
                documentos={documentos}
                onAnexar={anexarTipoFixo}
                onRemover={removerTipoFixo}
              />
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Endereço</CardTitle>
              <CardDescription>
                Digite o CEP para preencher o endereço automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-x-4 gap-y-5 sm:grid-cols-6">
              <FormField
                control={form.control}
                name="requerente.endereco.cep"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <InputMascara
                        {...field}
                        mascara={mascaraCep}
                        inputMode="numeric"
                        placeholder="00000-000"
                        autoComplete="postal-code"
                        onChange={(valor) => {
                          const completou = cepValido(valor) && !cepValido(field.value);
                          field.onChange(valor);
                          if (completou) void preencherEnderecoPorCep(valor);
                        }}
                      />
                    </FormControl>
                    {buscandoCep && (
                      <p className="text-xs text-muted-foreground">
                        Buscando endereço...
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <TextField form={form} name="requerente.endereco.logradouro" label="Logradouro" className="sm:col-span-4" />
              <TextField form={form} name="requerente.endereco.numero" label="Número" className="sm:col-span-2" />
              <TextField form={form} name="requerente.endereco.bairro" label="Bairro" className="sm:col-span-4" />
              <TextField form={form} name="requerente.endereco.cidade" label="Cidade" className="sm:col-span-4" />
              <TextField form={form} name="requerente.endereco.uf" label="UF" mascara={mascaraUf} className="sm:col-span-2" />
              <DocumentoInline
                tipo="COMPROVANTE_RESIDENCIA"
                label="Comprovante de residência"
                className="sm:col-span-6"
                documentos={documentos}
                onAnexar={anexarTipoFixo}
                onRemover={removerTipoFixo}
              />
            </CardContent>
          </Card>

          {/* Menor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados do menor</CardTitle>
            </CardHeader>
            <CardContent className={GRADE}>
              <TextField form={form} name="menor.nomeCompleto" label="Nome completo" className="sm:col-span-2" />
              <TextField form={form} name="menor.dataNascimento" label="Data de nascimento" type="date" />
              <TextField form={form} name="menor.naturalidade" label="Naturalidade (opcional)" placeholder="Ex.: Boa Vista/RR" />
              <RadioField form={form} name="menor.tipoDocumento" label="Documento de identificação" opcoes={DOCS} className="sm:grid-cols-4" wrapperClassName="sm:col-span-2" />
              <TextField form={form} name="menor.numeroDocumento" label="Nº do documento" />
              <DocumentoInline
                tipo="DOC_MENOR"
                label="Foto/cópia do documento do menor"
                documentos={documentos}
                onAnexar={anexarTipoFixo}
                onRemover={removerTipoFixo}
              />
            </CardContent>
          </Card>

          {/* Viagem */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados da viagem</CardTitle>
            </CardHeader>
            <CardContent className={GRADE}>
              <TextField form={form} name="dadosViagem.destino" label="Destino" className="sm:col-span-2" placeholder="Cidade/UF ou país" />
              <TextField form={form} name="dadosViagem.dataIda" label="Data de ida" type="date" />
              <TextField form={form} name="dadosViagem.dataVolta" label="Data de volta (opcional)" type="date" />
              <TextField form={form} name="dadosViagem.meioTransporte" label="Meio de transporte (opcional)" placeholder="Ex.: avião, ônibus" />
              {ehHospedagem && (
                <TextField form={form} name="dadosViagem.validadeDias" label="Validade (dias)" mascara={mascaraNumero} inputMode="numeric" />
              )}
              <DocumentoInline
                tipo="PASSAGEM"
                label={ehHospedagem ? "Cópia da reserva" : "Cópia do bilhete/passagem"}
                documentos={documentos}
                onAnexar={anexarTipoFixo}
                onRemover={removerTipoFixo}
              />
            </CardContent>
          </Card>

          {/* Responsável pela hospedagem/acompanhante */}
          {ehHospedagem && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Responsável pela hospedagem
                </CardTitle>
              </CardHeader>
              <CardContent className={GRADE}>
                <TextField form={form} name="responsavel.nomeCompleto" label="Nome completo" className="sm:col-span-2" />
                <TextField form={form} name="responsavel.cpf" label="CPF" mascara={mascaraCpf} inputMode="numeric" placeholder="000.000.000-00" />
                <TextField form={form} name="responsavel.numeroDocumento" label="Nº do documento" />
                <TextField form={form} name="responsavel.grauParentesco" label="Grau de parentesco" placeholder="Ex.: avó, tio" />
              </CardContent>
            </Card>
          )}

          {/* Documentos — ficam guardados no navegador e só são enviados
              junto com a solicitação, ao clicar em "Enviar solicitação". */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Outros documentos</CardTitle>
              <CardDescription>
                Opcional. Você também pode enviar depois pela tela de
                acompanhamento.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              {documentosExtras.length > 0 && (
                <ul className="divide-y rounded-md border text-sm">
                  {documentosExtras.map((doc, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 py-1 pr-1 pl-3">
                      <span className="truncate">
                        {TIPO_ANEXO_LABEL[doc.tipo]} — {doc.arquivo.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removerDocumento(doc)}
                      >
                        Remover
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              <Campo rotulo="Tipo de documento" className="sm:max-w-sm">
                {(id) => (
                  <Select
                    value={tipoStaging}
                    onValueChange={(v) => setTipoStaging(v as TipoAnexo)}
                  >
                    <SelectTrigger id={id} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_EXTRAS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {TIPO_ANEXO_LABEL[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Campo>
              <UploadArquivo
                rotulo={TIPO_ANEXO_LABEL[tipoStaging]}
                arquivo={null}
                onSelecionar={adicionarDocumento}
              />
            </CardContent>
          </Card>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button asChild variant="outline" type="button">
              <Link to="/">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar solicitação"}
            </Button>
          </div>
        </form>
      </Form>
    </PageContainer>
  );
}

// --- Campos reutilizáveis ---

/** Grade padrão dos cartões do formulário: 2 colunas a partir de sm. */
const GRADE = "grid gap-x-4 gap-y-5 sm:grid-cols-2";

/** Anexo de um tipo fixo, embutido na própria seção do formulário a que pertence. */
function DocumentoInline({
  tipo,
  label,
  className = "sm:col-span-2",
  documentos,
  onAnexar,
  onRemover,
}: {
  tipo: TipoAnexo;
  label: string;
  className?: string;
  documentos: DocumentoStaged[];
  onAnexar: (tipo: TipoAnexo, arquivo: File) => void;
  onRemover: (tipo: TipoAnexo) => void;
}) {
  const existente = documentos.find((d) => d.tipo === tipo);
  return (
    <UploadArquivo
      rotulo={label}
      arquivo={existente?.arquivo ?? null}
      onSelecionar={(arquivo) => onAnexar(tipo, arquivo)}
      onRemover={() => onRemover(tipo)}
      className={className}
    />
  );
}

interface TextFieldProps {
  form: UseFormReturn<Valores>;
  name: Campos;
  label: string;
  type?: string;
  className?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: ComponentProps<"input">["inputMode"];
  /** Máscara de lib/mascaras.ts aplicada a cada digitação. */
  mascara?: (valor: string) => string;
}

function TextField({ form, name, label, className, mascara, ...inputProps }: TextFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const value = (field.value as string | undefined) ?? "";
        return (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              {mascara ? (
                <InputMascara {...field} {...inputProps} value={value} mascara={mascara} />
              ) : (
                <Input {...field} {...inputProps} value={value} />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

interface RadioFieldProps<T extends string> {
  form: UseFormReturn<Valores>;
  name: Campos;
  label: string;
  opcoes: OpcaoRadio<T>[];
  /** Colunas das opções (ex.: "sm:grid-cols-3"). */
  className?: string;
  /** Classe do bloco inteiro dentro da grade do cartão (ex.: "sm:col-span-2"). */
  wrapperClassName?: string;
}

function RadioField<T extends string>({
  form,
  name,
  label,
  opcoes,
  className,
  wrapperClassName,
}: RadioFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldSet className={wrapperClassName} data-invalid={fieldState.invalid}>
          <FieldLegend variant="label" className="mb-2">
            {label}
          </FieldLegend>
          <OpcoesRadio
            opcoes={opcoes}
            value={field.value as T}
            onValueChange={field.onChange}
            aria-invalid={fieldState.invalid}
            className={className}
          />
          <FieldError errors={[fieldState.error]} />
        </FieldSet>
      )}
    />
  );
}
