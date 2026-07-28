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
import { INFO_SERVICO } from "@/lib/faq";

const SERVICOS = [
  {
    to: "/triagem",
    titulo: "Preciso de autorização?",
    descricao:
      "Responda perguntas simples e descubra se a viagem exige autorização.",
    Icon: Route,
  },
  {
    to: "/solicitar",
    titulo: "Solicitar Autorização",
    descricao:
      "Preencha o formulário com os dados do responsável, do menor e da viagem.",
    Icon: ClipboardPlus,
  },
  {
    to: "/acompanhar",
    titulo: "Acompanhamento",
    descricao: "Consulte o status e o histórico pelo número do protocolo.",
    Icon: FileSearch,
  },
  {
    to: "/perguntas",
    titulo: "Perguntas",
    descricao: "Tire dúvidas sobre autorização de viagem de menor.",
    Icon: CircleHelp,
  },
] as const;

const VIDEO_YOUTUBE_ID = "sVxZIsjgnRM";

export function HomePage() {
  const [mostrarVideo, setMostrarVideo] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 text-left">
      <header className="mb-10">
        <p className="text-sm font-medium tracking-wide text-primary uppercase">
          Seja bem-vindo!
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
          {INFO_SERVICO.titulo}
        </h1>
        <p className="mt-2 text-muted-foreground">{INFO_SERVICO.orgao}</p>


        <div className="mt-3 flex justify-center sm:justify-start">
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
            {mostrarVideo
              ? "Ocultar vídeo"
              : "Preciso solicitar autorização?"}
          </Button>
        </div>

        {mostrarVideo && (
          <div className="mx-auto mt-6 aspect-video w-full max-w-3xl overflow-hidden rounded-xl border bg-black shadow-sm">
            <iframe
              id="muraki-video-youtube"
              className="size-full"
              src={`https://www.youtube.com/embed/${VIDEO_YOUTUBE_ID}?autoplay=1`}
              title="Vídeo sobre o Muraki"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Serviços
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICOS.map(({ to, titulo, descricao, Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm transition hover:border-primary/40 hover:bg-primary/5"
            >
              <Icon className="mb-3 size-8 text-primary" strokeWidth={1.5} />
              <span className="font-semibold text-foreground">{titulo}</span>
              <span className="mt-2 text-sm text-muted-foreground">
                {descricao}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Card className="mx-auto max-w-3xl border-primary/30 bg-orange-700/8">
        <CardHeader>
          <CardTitle className="text-base">Informações do serviço</CardTitle>
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
    </div>
  );
}
