import { useState } from "react";
import { Link } from "react-router-dom";
import { CircleHelp, ClipboardPlus, FileSearch, Play, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Signpost } from "@/components/Signpost";
import { Pinwheel } from "@/components/Pinwheel";
import { PageContainer } from "@/components/layout/PageContainer";
import { INFO_SERVICO } from "@/lib/faq";

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
  {
    to: "/perguntas",
    titulo: "Perguntas",
    descricao: "Tire dúvidas sobre autorização de viagem de menor.",
    Icon: CircleHelp,
    cor: "var(--color-tepui)",
  },
] as const;

const VIDEO_YOUTUBE_ID = "sVxZIsjgnRM";

export function HomePage() {
  const [mostrarVideo, setMostrarVideo] = useState(false);

  return (
    <PageContainer largura="pagina" className="sm:py-14">
      <header className="mb-16 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-rio uppercase">
            Poder Judiciário de Roraima
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] font-semibold text-foreground sm:text-5xl">
            Uma placa,
            <br />
            três caminhos.
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
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

        <div className="relative mx-auto flex w-full max-w-sm justify-center">
          <Pinwheel
            className="absolute -top-6 -right-2 max-w-[64px] opacity-90 sm:max-w-[76px]"
          />
          <Signpost className="w-full" />
        </div>
      </header>

      <section className="mb-14">
        <h2 className="mb-1 font-display text-xl font-semibold text-foreground">
          Serviços
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Escolha por onde começar.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICOS.map(({ to, titulo, descricao, Icon, cor }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderTopWidth: 3, borderTopColor: cor }}
            >
              <Icon className="mb-4 size-6" style={{ color: cor }} strokeWidth={1.75} />
              <span className="font-display text-lg font-semibold text-foreground">
                {titulo}
              </span>
              <span className="mt-1.5 text-sm text-muted-foreground">
                {descricao}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display text-base">
            Informações do serviço
          </CardTitle>
          <CardDescription>{INFO_SERVICO.aviso}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <div>
            <span className="font-medium text-foreground">Atendimento: </span>
            {INFO_SERVICO.horario}
          </div>
          <div>
            <span className="font-medium text-foreground">WhatsApp: </span>
            {INFO_SERVICO.whatsapp}
          </div>
          <div className="sm:col-span-2">
            <span className="font-medium text-foreground">Endereço: </span>
            {INFO_SERVICO.endereco}
          </div>
          <div>
            <span className="font-medium text-foreground">Telefone: </span>
            {INFO_SERVICO.telefone}
          </div>
          <div>
            <span className="font-medium text-foreground">E-mail: </span>
            {INFO_SERVICO.email}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
