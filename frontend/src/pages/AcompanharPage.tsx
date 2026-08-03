import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ApiError,
  buscarAutorizacao,
  consultarPorProtocolo,
  enviarAnexoPorProtocolo,
} from "@/lib/api";
import { STATUS_BADGE_VARIANT, STATUS_LABEL } from "@/lib/statusSolicitacao";
import type {
  AutorizacaoDocumentoResponse,
  ConsultaProtocoloResponse,
  TipoAnexo,
} from "@/lib/types";

const TIPO_ANEXO_LABEL: Record<TipoAnexo, string> = {
  DOC_REQUERENTE: "Documento do requerente",
  DOC_MENOR: "Documento da criança/adolescente",
  DOC_ACOMPANHANTE: "Documento do acompanhante",
  COMPROVANTE_RESIDENCIA: "Comprovante de residência",
  PASSAGEM: "Cópia da passagem",
  TERMO_GUARDA: "Termo de guarda/tutela",
  SELFIE_RG: "Selfie segurando o RG",
};

const STATUS_COM_AUTORIZACAO = new Set([
  "DEFERIDA",
  "AGUARDANDO_ASSINATURA",
  "CONCLUIDA",
]);

const STATUS_ACEITA_ANEXO = new Set([
  "RECEBIDA",
  "EM_ANALISE",
  "PENDENTE_CORRECAO",
]);

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function AcompanharPage() {
  const [params] = useSearchParams();
  const [protocolo, setProtocolo] = useState(params.get("protocolo") ?? "");
  const [dados, setDados] = useState<ConsultaProtocoloResponse | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const [tipoAnexo, setTipoAnexo] = useState<TipoAnexo>("DOC_REQUERENTE");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviandoAnexo, setEnviandoAnexo] = useState(false);

  const [autorizacao, setAutorizacao] =
    useState<AutorizacaoDocumentoResponse | null>(null);
  const [carregandoAutorizacao, setCarregandoAutorizacao] = useState(false);

  async function consultar(p: string) {
    if (!p.trim()) return;
    setCarregando(true);
    setErro(null);
    setDados(null);
    setAutorizacao(null);
    try {
      setDados(await consultarPorProtocolo(p.trim()));
    } catch (e) {
      setErro(
        e instanceof ApiError ? e.message : "Não foi possível consultar.",
      );
    } finally {
      setCarregando(false);
    }
  }

  // Consulta automática se veio protocolo na URL (após criar a solicitação).
  useEffect(() => {
    const p = params.get("protocolo");
    if (!p) return;
    let cancelado = false;
    consultarPorProtocolo(p)
      .then((res) => {
        if (!cancelado) {
          setDados(res);
          setErro(null);
        }
      })
      .catch((e) => {
        if (!cancelado) {
          setErro(
            e instanceof ApiError ? e.message : "Não foi possível consultar.",
          );
        }
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function enviarAnexo() {
    if (!dados || !arquivo) return;
    setEnviandoAnexo(true);
    try {
      const atualizado = await enviarAnexoPorProtocolo(
        dados.protocolo,
        tipoAnexo,
        arquivo,
      );
      setDados(atualizado);
      setArquivo(null);
      toast.success("Documento enviado.");
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "Não foi possível enviar o anexo.",
      );
    } finally {
      setEnviandoAnexo(false);
    }
  }

  async function verAutorizacao() {
    if (!dados) return;
    setCarregandoAutorizacao(true);
    try {
      setAutorizacao(await buscarAutorizacao(dados.protocolo));
    } catch (e) {
      toast.error(
        e instanceof ApiError
          ? e.message
          : "Não foi possível carregar a autorização.",
      );
    } finally {
      setCarregandoAutorizacao(false);
    }
  }

  if (autorizacao) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-left print:max-w-none print:px-0 print:py-0">
        <div className="mb-4 flex gap-3 print:hidden">
          <Button variant="outline" onClick={() => setAutorizacao(null)}>
            ← Voltar
          </Button>
          <Button className="gap-2" onClick={() => window.print()}>
            <Printer className="size-4" /> Imprimir / salvar PDF
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-8 text-sm leading-relaxed print:border-none print:p-0 print:shadow-none">
          <p className="mb-4 rounded bg-amber-100 p-2 text-xs font-medium text-amber-900 print:hidden">
            Prévia gerada a partir dos dados deferidos pela unidade competente.
            Ainda não possui o mecanismo de verificação de autenticidade (QR
            Code) previsto para a versão final.
          </p>

          <p className="text-center font-bold">
            AUTORIZAÇÃO DE VIAGEM NACIONAL
          </p>
          <p className="mb-4 text-center">
            Protocolo {autorizacao.protocolo} — deferida em{" "}
            {formatarData(autorizacao.deferidoEm)}
          </p>

          <p className="mb-2">
            Autoriza-se, com base na solicitação protocolada por{" "}
            {autorizacao.requerente.nomeCompleto ?? "____"}
            {autorizacao.requerente.cpf && (
              <>, CPF nº {autorizacao.requerente.cpf}</>
            )}
            , na qualidade de {autorizacao.tipoResponsavel}, a viagem nacional
            de{" "}
            <span className="font-medium">
              {autorizacao.menor.nomeCompleto}
            </span>
            , nascido(a) em{" "}
            {autorizacao.menor.dataNascimento &&
              formatarData(autorizacao.menor.dataNascimento)}
            , com destino a {autorizacao.dadosViagem.destino}, no período de{" "}
            {formatarData(autorizacao.dadosViagem.dataIda)}
            {autorizacao.dadosViagem.dataVolta &&
              ` a ${formatarData(autorizacao.dadosViagem.dataVolta)}`}
            .
          </p>

          {autorizacao.responsavel?.nomeCompleto && (
            <p className="mb-2">
              Acompanhante autorizado: {autorizacao.responsavel.nomeCompleto}
              {autorizacao.responsavel.cpf &&
                `, CPF nº ${autorizacao.responsavel.cpf}`}
              .
            </p>
          )}

          <p className="mt-8 text-center text-xs text-muted-foreground print:text-black">
            Poder Judiciário do Estado de Roraima — Divisão de Proteção das
            Varas da Infância e Juventude de Boa Vista/RR
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-left">
      <div className="mb-6">
        <Button asChild variant="link" size="sm" className="px-0">
          <Link to="/">← Voltar</Link>
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">
          Acompanhar solicitação
        </h1>
        <p className="text-sm text-muted-foreground">
          Informe o número do protocolo recebido ao enviar o pedido.
        </p>
      </div>

      <form
        className="mb-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          consultar(protocolo);
        }}
      >
        <Input
          placeholder="VL-2026-000000"
          value={protocolo}
          onChange={(e) => setProtocolo(e.target.value)}
        />
        <Button type="submit" disabled={carregando}>
          {carregando ? "Consultando..." : "Consultar"}
        </Button>
      </form>

      {erro && <p className="text-sm text-destructive">{erro}</p>}

      {dados && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{dados.protocolo}</CardTitle>
                <Badge variant={STATUS_BADGE_VARIANT[dados.status]}>
                  {STATUS_LABEL[dados.status]}
                </Badge>
              </div>
              <CardDescription>
                {dados.menorNome ? `Menor: ${dados.menorNome}` : null}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="mb-3 text-sm font-medium text-foreground">
                Histórico
              </h3>
              <ol className="space-y-3">
                {dados.historico.map((h, i) => (
                  <li key={i} className="border-l-2 border-primary/40 pl-3">
                    <div className="text-sm font-medium text-foreground">
                      {STATUS_LABEL[h.statusNovo]}
                    </div>
                    {h.observacao && (
                      <div className="text-sm text-muted-foreground">
                        {h.observacao}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {new Date(h.ocorridoEm).toLocaleString("pt-BR")}
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {STATUS_COM_AUTORIZACAO.has(dados.status) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Autorização</CardTitle>
                <CardDescription>
                  Sua solicitação foi deferida. Veja e imprima a autorização.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button disabled={carregandoAutorizacao} onClick={verAutorizacao}>
                  {carregandoAutorizacao ? "Carregando..." : "Ver autorização"}
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Documentos enviados ({dados.anexos.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dados.anexos.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum documento enviado ainda.
                </p>
              ) : (
                <ul className="space-y-1 text-sm">
                  {dados.anexos.map((a) => (
                    <li key={a.id} className="flex justify-between gap-2">
                      <span>
                        {TIPO_ANEXO_LABEL[a.tipo]} — {a.nomeArquivo}
                      </span>
                      <span className="text-muted-foreground">
                        {(a.tamanhoBytes / 1024).toFixed(0)} KB
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {STATUS_ACEITA_ANEXO.has(dados.status) && (
                <div className="grid gap-3 border-t pt-4 sm:grid-cols-[1fr_1fr_auto]">
                  <div>
                    <Label>Tipo de documento</Label>
                    <Select
                      value={tipoAnexo}
                      onValueChange={(v) => setTipoAnexo(v as TipoAnexo)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(TIPO_ANEXO_LABEL) as TipoAnexo[]).map(
                          (t) => (
                            <SelectItem key={t} value={t}>
                              {TIPO_ANEXO_LABEL[t]}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Arquivo</Label>
                    <Input
                      type="file"
                      onChange={(e) =>
                        setArquivo(e.target.files?.[0] ?? null)
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      disabled={!arquivo || enviandoAnexo}
                      onClick={enviarAnexo}
                    >
                      {enviandoAnexo ? "Enviando..." : "Enviar"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
