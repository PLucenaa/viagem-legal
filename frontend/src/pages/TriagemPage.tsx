import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, FileCheck2, X } from "lucide-react";
import gsap from "gsap";

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
  const conteudoRef = useRef<HTMLDivElement>(null);
  const docsRef = useRef<HTMLUListElement>(null);

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

  // Anima a troca de pergunta/resultado a cada resposta.
  useLayoutEffect(() => {
    if (!conteudoRef.current) return;
    gsap.fromTo(
      conteudoRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
    );
  }, [erro, carregando, resultado]);

  // Revela a checklist de documentos em cascata quando o resultado sai.
  useEffect(() => {
    if (resultado?.concluido && docsRef.current) {
      gsap.fromTo(
        docsRef.current.children,
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.35,
          stagger: 0.08,
          delay: 0.2,
          ease: "power2.out",
        },
      );
    }
  }, [resultado]);

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

      <div ref={conteudoRef}>
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

            {resultado.documentosNecessarios &&
              resultado.documentosNecessarios.length > 0 && (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileCheck2 className="size-4 text-primary" />
                    Documentos necessários
                  </p>
                  <ul
                    ref={docsRef}
                    className="space-y-1.5 text-sm text-muted-foreground"
                  >
                    {resultado.documentosNecessarios.map((doc) => (
                      <li key={doc} className="flex gap-2">
                        <span aria-hidden className="text-primary">
                          •
                        </span>
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {resultado.caminho === "DISPENSA" && (
              <p className="text-sm">
                Este aviso não substitui nenhum documento de viagem — ele só
                informa que, com os documentos acima, não é necessária
                nenhuma autorização adicional para essa viagem.
              </p>
            )}

            {resultado.caminho === "EXTRAJUDICIAL" && (
              <div className="space-y-3 text-sm">
                <p>
                  Você pode preencher agora o modelo de autorização (a
                  assinatura ainda precisa ter a firma reconhecida em
                  cartório, por semelhança ou autenticidade). Em caso de
                  dúvida, fale com a{" "}
                  <span className="font-medium text-foreground">
                    {INFO_SERVICO.orgao}
                  </span>{" "}
                  — WhatsApp: {INFO_SERVICO.whatsapp} · E-mail:{" "}
                  {INFO_SERVICO.email}
                </p>
                <Button asChild>
                  <Link
                    to="/triagem/extrajudicial"
                    state={{
                      acompanhado:
                        respostas.viajaComPessoaAutorizadaPeloResponsavel ===
                        true,
                    }}
                  >
                    Preencher documento agora
                  </Link>
                </Button>
              </div>
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
    </div>
  );
}
