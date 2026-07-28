import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiError, avaliarTriagem } from "@/lib/api";
import { INFO_SERVICO } from "@/lib/faq";
import type {
  CaminhoTriagem,
  PassoTriagem,
  TriagemRequest,
  TriagemResultadoResponse,
} from "@/lib/types";

// Cada passo da árvore corresponde a um campo do payload — ver
// arvore_decisao_resolucao_cnj_295_2019.md e TriagemService no backend.
const CAMPO_POR_PASSO: Record<PassoTriagem, keyof TriagemRequest> = {
  PASSO_1_IDADE: "maiorOuIgualDezesseisAnos",
  PASSO_2_ACOMPANHA_RESPONSAVEL: "viajaComPaiMaeOuResponsavelLegal",
  PASSO_3_DESTINO_COMARCA: "destinoComarcaContiguaOuMesmaRegiaoMetropolitana",
  PASSO_4_ACOMPANHA_PARENTE: "viajaComAscendenteOuColateralAteTerceiroGrau",
  PASSO_4B_PARENTESCO_COMPROVAVEL: "parentescoComprovavelDocumentalmente",
  PASSO_5_ACOMPANHA_AUTORIZADO: "viajaComPessoaAutorizadaPeloResponsavel",
  PASSO_6_DESACOMPANHADO: "viajaDesacompanhado",
  PASSO_6_1_PASSAPORTE_AUTORIZADO: "passaporteValidoComAutorizacaoParaExterior",
  PASSO_6_2_AUTORIZACAO_GENITOR: "autorizacaoExpressaDeGenitorOuResponsavel",
};

const TITULO_CAMINHO: Record<CaminhoTriagem, string> = {
  DISPENSA: "Autorização dispensada",
  EXTRAJUDICIAL: "Autorização extrajudicial",
  UNIDADE_COMPETENTE: "Necessário trâmite pela unidade competente",
};

export function TriagemPage() {
  const [respostas, setRespostas] = useState<TriagemRequest>({});
  const [resultado, setResultado] = useState<TriagemResultadoResponse | null>(
    null,
  );
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const inicializado = useRef(false);

  function avaliar(payload: TriagemRequest) {
    setCarregando(true);
    setErro(null);
    avaliarTriagem(payload)
      .then((res) => setResultado(res))
      .catch((e) => {
        setErro(
          e instanceof ApiError
            ? e.message
            : "Não foi possível avaliar a triagem agora.",
        );
      })
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    if (inicializado.current) return;
    inicializado.current = true;
    avaliarTriagem({})
      .then((res) => setResultado(res))
      .catch((e) => {
        setErro(
          e instanceof ApiError
            ? e.message
            : "Não foi possível avaliar a triagem agora.",
        );
      })
      .finally(() => setCarregando(false));
  }, []);

  function responder(valor: boolean) {
    if (!resultado?.proximoPasso) return;
    const campo = CAMPO_POR_PASSO[resultado.proximoPasso];
    const novasRespostas = { ...respostas, [campo]: valor };
    setRespostas(novasRespostas);
    avaliar(novasRespostas);
  }

  function reiniciar() {
    setRespostas({});
    avaliar({});
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-left">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Preciso de autorização de viagem?
        </h1>
        <p className="mt-2 text-muted-foreground">
          Responda algumas perguntas simples para descobrir se a viagem
          nacional da criança ou adolescente exige autorização.
        </p>
        <Button asChild variant="link" className="mt-2 px-0">
          <Link to="/">← Voltar</Link>
        </Button>
      </header>

      {erro && (
        <Card className="border-destructive/40">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{erro}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => avaliar(respostas)}
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {!erro && carregando && (
        <p className="text-muted-foreground">Carregando…</p>
      )}

      {!erro && !carregando && resultado && !resultado.concluido && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{resultado.pergunta}</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button className="gap-2" onClick={() => responder(true)}>
              <Check className="size-4" /> Sim
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => responder(false)}
            >
              <X className="size-4" /> Não
            </Button>
          </CardContent>
        </Card>
      )}

      {!erro && !carregando && resultado?.concluido && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {resultado.caminho && TITULO_CAMINHO[resultado.caminho]}
            </CardTitle>
            <CardDescription>
              Fundamento: {resultado.fundamentoLegal} da Resolução CNJ nº
              295/2019
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {resultado.mensagem}
            </p>

            {resultado.caminho === "DISPENSA" && (
              <p className="text-sm">
                Leve consigo um documento de identificação da criança ou
                adolescente e, quando houver acompanhante, um documento que
                comprove o vínculo ou a autorização. Este aviso não substitui
                nenhum documento de viagem.
              </p>
            )}

            {resultado.caminho === "EXTRAJUDICIAL" && (
              <p className="text-sm">
                Fale com a{" "}
                <span className="font-medium text-foreground">
                  {INFO_SERVICO.orgao}
                </span>{" "}
                para obter o modelo de autorização adequado (assinado por
                escritura pública ou documento particular com firma
                reconhecida). WhatsApp: {INFO_SERVICO.whatsapp} · E-mail:{" "}
                {INFO_SERVICO.email}
              </p>
            )}

            {resultado.caminho === "UNIDADE_COMPETENTE" && (
              <Button asChild>
                <Link to="/solicitar">Iniciar solicitação</Link>
              </Button>
            )}

            <div>
              <Button variant="link" className="px-0" onClick={reiniciar}>
                Refazer a triagem
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
