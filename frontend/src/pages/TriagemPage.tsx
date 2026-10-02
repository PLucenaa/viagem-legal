import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, FileCheck2, RotateCcw, X } from "lucide-react";
import gsap from "gsap";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ApiError, avaliarTriagem } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Signpost } from "@/components/Signpost";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { INFO_SERVICO } from "@/lib/faq";
import { cn } from "@/lib/utils";
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
  // Ordem em que as perguntas foram respondidas — permite desfazer a última.
  const [historico, setHistorico] = useState<(keyof TriagemRequest)[]>([]);
  const [resultado, setResultado] = useState<TriagemResultadoResponse | null>(
    null,
  );
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const inicializado = useRef(false);
  // Número da pergunta que está na tela — só muda quando a próxima chega,
  // pra não trocar o número enquanto a pergunta antiga ainda aparece.
  const [numeroPergunta, setNumeroPergunta] = useState(1);
  const docsRef = useRef<HTMLUListElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);

  function avaliar(payload: TriagemRequest, numero: number) {
    setCarregando(true);
    setErro(null);
    avaliarTriagem(payload)
      .then((res) => {
        setResultado(res);
        setNumeroPergunta(numero);
      })
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
    setHistorico((h) => [...h, campo]);
    jaRespondeu.current = true;
    avaliar(novasRespostas, historico.length + 2);
  }

  /** Desfaz a última resposta e volta à pergunta anterior. */
  function voltarPergunta() {
    const ultimo = historico.at(-1);
    if (!ultimo) return;
    const novasRespostas = { ...respostas };
    delete novasRespostas[ultimo];
    setRespostas(novasRespostas);
    setHistorico((h) => h.slice(0, -1));
    avaliar(novasRespostas, historico.length);
  }

  function reiniciar() {
    setRespostas({});
    setHistorico([]);
    avaliar({}, 1);
  }

  const reduzirMovimento =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Revela a checklist de documentos em cascata quando o resultado sai.
  useEffect(() => {
    if (resultado?.concluido && docsRef.current && !reduzirMovimento) {
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
  }, [resultado, reduzirMovimento]);

  // Depois de responder (ou voltar), leva o foco à pergunta/resultado novo.
  // Na primeira pergunta não: o foco fica onde o navegador deixou ao abrir.
  const jaRespondeu = useRef(false);
  useEffect(() => {
    if (carregando || !jaRespondeu.current) return;
    tituloRef.current?.focus();
  }, [carregando]);

  return (
    <PageContainer>
      <PageHeader
        atual="Preciso de autorização?"
        titulo="Preciso de autorização de viagem?"
        descricao="Responda algumas perguntas simples para descobrir se a viagem nacional da criança ou do adolescente exige autorização."
        centralizado
      />

      {/* Pergunta numa coluna estreita; o resultado (placa + texto lado a
          lado) precisa de mais largura. */}
      <div
        className={cn(
          "mx-auto",
          resultado?.concluido && !erro ? "max-w-5xl" : "max-w-2xl",
        )}
      >
      {erro && (
        <Card className="border-destructive/40">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{erro}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => avaliar(respostas, historico.length + 1)}
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {!erro && (!resultado || !resultado.concluido) && (
        <Card aria-busy={carregando}>
          <CardHeader
            className={cn(
              "gap-3 transition-opacity sm:px-8",
              carregando && resultado && "opacity-60",
            )}
          >
            {!resultado ? (
              <>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-2/3" />
                <span className="sr-only">Carregando a pergunta…</span>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Pergunta {numeroPergunta}
                </p>
                {/* Recebe o foco ao avançar/voltar (tabIndex -1), como no
                    Questionnaire do shadcn: o leitor de tela lê a pergunta
                    nova e o Tab segue direto pras respostas. */}
                <h2
                  ref={tituloRef}
                  tabIndex={-1}
                  className="font-display text-2xl leading-tight font-semibold text-balance outline-none"
                >
                  {resultado?.pergunta}
                </h2>
              </>
            )}
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-3 sm:px-8">
            <Button
              size="lg"
              className="h-14 gap-2 text-base"
              disabled={carregando}
              onClick={() => responder(true)}
            >
              <Check className="size-5" aria-hidden /> Sim
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 gap-2 text-base"
              disabled={carregando}
              onClick={() => responder(false)}
            >
              <X className="size-5" aria-hidden /> Não
            </Button>
          </CardContent>

          {historico.length > 0 && (
            <CardFooter className="border-t sm:px-8">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 gap-2 text-muted-foreground"
                disabled={carregando}
                onClick={voltarPergunta}
              >
                <ArrowLeft className="size-4" aria-hidden />
                Pergunta anterior
              </Button>
            </CardFooter>
          )}
        </Card>
      )}

      {!erro && resultado?.concluido && (
        <Card
          aria-busy={carregando}
          className={cn(
            "gap-0 overflow-hidden py-0 transition-opacity",
            carregando && "opacity-60",
          )}
        >
          {/* Placa à esquerda (em cima no celular), texto à direita. */}
          <div className="grid md:grid-cols-[minmax(0,24rem)_1fr]">
            <div className="flex items-center justify-center bg-secondary/50 p-6">
              <Signpost ativo={resultado.caminho} className="max-w-[320px] md:max-w-none" />
            </div>

            <div className="grid content-start gap-5 p-6 sm:p-8">
              <div className="grid gap-2">
                <h2
                  ref={tituloRef}
                  tabIndex={-1}
                  className="font-display text-2xl leading-tight font-semibold text-balance outline-none"
                >
                  {resultado.caminho && TITULO_CAMINHO[resultado.caminho]}
                </h2>
                <CardDescription>
                  Fundamento: {resultado.fundamentoLegal} da Resolução CNJ nº
                  295/2019
                </CardDescription>
              </div>

              <p className="text-pretty text-muted-foreground">
                {resultado.mensagem}
              </p>

              {resultado.documentosNecessarios &&
                resultado.documentosNecessarios.length > 0 && (
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                      <FileCheck2 className="size-4 text-primary" aria-hidden />
                      Documentos necessários
                    </p>
                    <ul
                      ref={docsRef}
                      className="space-y-2 text-sm text-muted-foreground"
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
                <p className="text-sm text-pretty">
                  Este aviso não substitui nenhum documento de viagem — ele só
                  informa que, com os documentos acima, não é necessária
                  nenhuma autorização adicional para essa viagem.
                </p>
              )}

              {resultado.caminho === "EXTRAJUDICIAL" && (
                <>
                  <p className="text-sm text-pretty">
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
                  <Button asChild size="lg" className="justify-self-start">
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
                </>
              )}

              {resultado.caminho === "UNIDADE_COMPETENTE" && (
                <Button asChild size="lg" className="justify-self-start">
                  <Link to="/solicitar">Iniciar solicitação</Link>
                </Button>
              )}
            </div>
          </div>

          <CardFooter className="flex-wrap gap-2 border-t py-4 sm:px-8">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              disabled={carregando}
              onClick={voltarPergunta}
            >
              <ArrowLeft className="size-4" aria-hidden />
              Mudar a última resposta
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              disabled={carregando}
              onClick={reiniciar}
            >
              <RotateCcw className="size-4" aria-hidden />
              Refazer a triagem
            </Button>
          </CardFooter>
        </Card>
      )}
      </div>
    </PageContainer>
  );
}
