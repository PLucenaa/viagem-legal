import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { criarSolicitacao } from "@/lib/api";
import { ApiError } from "@/lib/api";
import {
  solicitacaoSchema,
  type SolicitacaoFormValues,
} from "@/lib/solicitacaoSchema";
import type { SolicitacaoRequest } from "@/lib/types";

const DOCS = [
  { v: "RG", l: "RG" },
  { v: "CNH", l: "CNH" },
  { v: "PASSAPORTE", l: "Passaporte" },
  { v: "CERTIDAO_NASCIMENTO", l: "Certidão de Nascimento" },
] as const;

export function SolicitarPage() {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);

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
      const criada = await criarSolicitacao(payload);
      toast.success(`Solicitação criada! Protocolo ${criada.protocolo}`);
      navigate(`/acompanhar?protocolo=${criada.protocolo}`);
    } catch (e) {
      const msg =
        e instanceof ApiError ? e.message : "Falha ao enviar a solicitação.";
      toast.error(msg);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-left">
      <div className="mb-6">
        <Button asChild variant="link" size="sm" className="px-0">
          <Link to="/">← Voltar</Link>
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">
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
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="tipoAutorizacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autorização</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NACIONAL">Viagem nacional</SelectItem>
                        <SelectItem value="INTERNACIONAL">
                          Viagem internacional
                        </SelectItem>
                        <SelectItem value="HOSPEDAGEM">Hospedagem</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipoResponsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Você é</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PAI">Pai</SelectItem>
                        <SelectItem value="MAE">Mãe</SelectItem>
                        <SelectItem value="TUTOR">Tutor(a)</SelectItem>
                        <SelectItem value="GUARDIAO">Guardião(ã)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Requerente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados do responsável</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <TextField form={form} name="requerente.nomeCompleto" label="Nome completo" />
              <TextField form={form} name="requerente.cpf" label="CPF" />
              <DocSelect form={form} name="requerente.tipoDocumento" label="Documento" />
              <TextField form={form} name="requerente.numeroDocumento" label="Nº do documento" />
              <TextField form={form} name="requerente.orgaoExpedidor" label="Órgão expedidor" />
              <TextField form={form} name="requerente.telefone" label="Telefone" />
              <TextField form={form} name="requerente.email" label="E-mail (opcional)" />
              <TextField form={form} name="requerente.profissao" label="Profissão (opcional)" />
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Endereço (Boa Vista/RR)</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <TextField form={form} name="requerente.endereco.logradouro" label="Logradouro" />
              <TextField form={form} name="requerente.endereco.numero" label="Número" />
              <TextField form={form} name="requerente.endereco.bairro" label="Bairro" />
              <TextField form={form} name="requerente.endereco.cidade" label="Cidade" />
              <TextField form={form} name="requerente.endereco.uf" label="UF" />
              <TextField form={form} name="requerente.endereco.cep" label="CEP" />
            </CardContent>
          </Card>

          {/* Menor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados do menor</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <TextField form={form} name="menor.nomeCompleto" label="Nome completo" />
              <TextField form={form} name="menor.dataNascimento" label="Data de nascimento" type="date" />
              <DocSelect form={form} name="menor.tipoDocumento" label="Documento" />
              <TextField form={form} name="menor.numeroDocumento" label="Nº do documento" />
              <TextField form={form} name="menor.naturalidade" label="Naturalidade (opcional)" />
            </CardContent>
          </Card>

          {/* Viagem */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados da viagem</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <TextField form={form} name="dadosViagem.destino" label="Destino" />
              <TextField form={form} name="dadosViagem.dataIda" label="Data de ida" type="date" />
              <TextField form={form} name="dadosViagem.dataVolta" label="Data de volta (opcional)" type="date" />
              <TextField form={form} name="dadosViagem.meioTransporte" label="Meio de transporte (opcional)" />
              {ehHospedagem && (
                <TextField form={form} name="dadosViagem.validadeDias" label="Validade (dias)" type="number" />
              )}
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
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <TextField form={form} name="responsavel.nomeCompleto" label="Nome completo" />
                <TextField form={form} name="responsavel.cpf" label="CPF" />
                <TextField form={form} name="responsavel.numeroDocumento" label="Nº do documento" />
                <TextField form={form} name="responsavel.grauParentesco" label="Grau de parentesco" />
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-3">
            <Button asChild variant="outline" type="button">
              <Link to="/">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar solicitação"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// --- Campos reutilizáveis ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TextField({ form, name, label, type = "text" }: any) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DocSelect({ form, name, label }: any) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {DOCS.map((d) => (
                <SelectItem key={d.v} value={d.v}>
                  {d.l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
