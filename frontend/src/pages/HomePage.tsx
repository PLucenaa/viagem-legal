import { Link } from "react-router-dom";
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
import { Separator } from "@/components/ui/separator";
import { FAQ, INFO_SERVICO } from "@/lib/faq";

export function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-left">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {INFO_SERVICO.titulo}
        </h1>
        <p className="mt-2 text-muted-foreground">{INFO_SERVICO.orgao}</p>
      </header>

      <Card className="mb-8 border-primary/30 bg-primary/5">
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

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Perguntas frequentes
        </h2>
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

      <Separator className="my-8" />

      <div className="flex flex-col items-center gap-3 rounded-lg bg-muted/40 p-8 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          Pronto para solicitar?
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Preencha o formulário com os dados do responsável, do menor e da
          viagem. O serviço é gratuito.
        </p>
        <Button asChild size="lg" className="mt-2">
          <Link to="/solicitar">Solicitar autorização</Link>
        </Button>
        <Button asChild variant="link" size="sm">
          <Link to="/acompanhar">Já tenho um protocolo — acompanhar</Link>
        </Button>
      </div>
    </div>
  );
}
