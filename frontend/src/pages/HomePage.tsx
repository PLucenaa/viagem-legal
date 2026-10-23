import { useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardPlus, FileSearch, Play, Route } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CriancaPapagaio } from "@/components/CriancaPapagaio";
import { PageContainer } from "@/components/layout/PageContainer";
import { cn } from "@/lib/utils";
import { FAQ, INFO_SERVICO } from "@/lib/faq";

const SERVICOS = [
  {
    to: "/triagem",
    titulo: "Preciso de autorização?",
    descricao:
      "Responda perguntas simples e descubra se a viagem exige autorização.",
    Icon: Route,
    cor: "var(--color-lavrado)",
  },
  {
    to: "/solicitar",
    titulo: "Solicitar autorização",
    descricao:
      "Preencha o formulário com os dados do responsável, do menor e da viagem.",
    Icon: ClipboardPlus,
    cor: "var(--color-estrada)",
  },
  {
    to: "/acompanhar",
    titulo: "Acompanhamento",
    descricao: "Consulte o status e o histórico pelo número do protocolo.",
    Icon: FileSearch,
    cor: "var(--color-rio)",
  },
] as const;

const VIDEO_YOUTUBE_ID = "U3hYDknkFOc";

/** Texto estático focável no Tab — o anel só aparece com teclado, o visual em repouso não muda. */
const FOCO_TEXTO =
  "rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function HomePage() {
  const [mostrarVideo, setMostrarVideo] = useState(false);

  return (
    <PageContainer className="sm:py-14">
      <section
        aria-labelledby="titulo-home"
        aria-describedby="resumo-home"
        className="mb-16 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div>
          <h1 id="titulo-home" tabIndex={0} className={FOCO_TEXTO}>
            <span className="block font-sans text-xs font-semibold tracking-[0.14em] text-rio uppercase">
              Poder Judiciário de Roraima
            </span>
            <span className="mt-3 block font-display text-4xl leading-[1.05] font-semibold text-foreground sm:text-5xl">
              Viagem
              <br />
              Legal
            </span>
          </h1>
          <p
            id="resumo-home"
            tabIndex={0}
            className={cn("mt-4 max-w-md text-muted-foreground", FOCO_TEXTO)}
          >
            {INFO_SERVICO.titulo}. Descubra em poucos minutos se a viagem da
            criança ou do adolescente precisa de autorização — e qual é o
            caminho certo para o seu caso.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/triagem">
                <Route className="size-4" />
                Começar a triagem
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="gap-2"
              aria-expanded={mostrarVideo}
              aria-controls="viagemlegal-video-youtube"
              onClick={() => setMostrarVideo((v) => !v)}
            >
              <Play className="size-4" />
              {mostrarVideo ? "Ocultar vídeo" : "Assistir explicação"}
            </Button>
          </div>

          {mostrarVideo && (
            <div className="mt-6 aspect-video w-full max-w-xl overflow-hidden rounded-lg border border-border bg-ink shadow-sm">
              <iframe
                id="viagemlegal-video-youtube"
                className="size-full"
                src={`https://www.youtube.com/embed/${VIDEO_YOUTUBE_ID}?autoplay=1`}
                title="Vídeo sobre a autorização de viagem"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </div>

        <div className="mx-auto flex w-full max-w-sm justify-center">
          <CriancaPapagaio className="w-full" />
        </div>
      </section>

      <section
        className="mb-14"
        aria-labelledby="servicos"
        aria-describedby="servicos-apoio"
      >
        <h2
          id="servicos"
          tabIndex={0}
          className={cn(
            "mb-1 font-display text-xl font-semibold text-foreground",
            FOCO_TEXTO,
          )}
        >
          Serviços
        </h2>
        <p
          id="servicos-apoio"
          tabIndex={0}
          className={cn("mb-5 text-sm text-muted-foreground", FOCO_TEXTO)}
        >
          Escolha por onde começar.
        </p>
        <ul className="grid list-none gap-4 p-0 sm:grid-cols-3">
          {SERVICOS.map(({ to, titulo, descricao, Icon, cor }) => (
            <li key={to} className="min-w-0">
              <Link
                to={to}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderTopWidth: 3, borderTopColor: cor }}
              >
                <Icon
                  className="mb-4 size-6"
                  style={{ color: cor }}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="font-display text-lg font-semibold text-foreground">
                  {titulo}
                </span>
                <span className="mt-1.5 text-sm text-muted-foreground">
                  {descricao}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="mb-14"
        aria-labelledby="perguntas-frequentes"
        aria-describedby="perguntas-frequentes-apoio"
      >
        <h2
          id="perguntas-frequentes"
          tabIndex={0}
          className={cn(
            "mb-1 font-display text-xl font-semibold text-foreground",
            FOCO_TEXTO,
          )}
        >
          Perguntas frequentes
        </h2>
        <p
          id="perguntas-frequentes-apoio"
          tabIndex={0}
          className={cn("mb-3 text-sm text-muted-foreground", FOCO_TEXTO)}
        >
          Tire dúvidas sobre autorização de viagem de criança e adolescente.
        </p>
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">
                {item.pergunta}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.resposta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section
        aria-labelledby="informacoes-servico"
        aria-describedby="informacoes-servico-aviso"
      >
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-base">
              <h2
                id="informacoes-servico"
                tabIndex={0}
                className={cn(
                  "m-0 text-base leading-none font-semibold",
                  FOCO_TEXTO,
                )}
              >
                Informações do serviço
              </h2>
            </CardTitle>
            <CardDescription>
              <p
                id="informacoes-servico-aviso"
                tabIndex={0}
                className={cn("m-0", FOCO_TEXTO)}
              >
                {INFO_SERVICO.aviso}
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <div tabIndex={0} className={FOCO_TEXTO}>
                <dt className="inline font-medium text-foreground">Atendimento: </dt>
                <dd className="inline">{INFO_SERVICO.horario}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-foreground">WhatsApp: </dt>
                <dd className="inline">
                  <a
                    href={`tel:+55${INFO_SERVICO.whatsapp.replace(/\D/g, "")}`}
                    className="underline decoration-foreground/30 underline-offset-2"
                  >
                    {INFO_SERVICO.whatsapp}
                  </a>
                </dd>
              </div>
              <div tabIndex={0} className={cn("sm:col-span-2", FOCO_TEXTO)}>
                <dt className="inline font-medium text-foreground">Endereço: </dt>
                <dd className="inline">{INFO_SERVICO.endereco}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-foreground">Telefone: </dt>
                <dd className="inline">
                  <a
                    href={`tel:+55${INFO_SERVICO.telefone.replace(/\D/g, "")}`}
                    className="underline decoration-foreground/30 underline-offset-2"
                  >
                    {INFO_SERVICO.telefone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="inline font-medium text-foreground">E-mail: </dt>
                <dd className="inline">
                  <a
                    href={`mailto:${INFO_SERVICO.email}`}
                    className="underline decoration-foreground/30 underline-offset-2"
                  >
                    {INFO_SERVICO.email}
                  </a>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}
