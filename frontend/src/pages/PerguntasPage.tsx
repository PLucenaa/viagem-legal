import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/lib/faq";

export function PerguntasPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-10 text-left">
            <header className="mb-8">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Perguntas frequentes
                </h1>
                <Button asChild variant="link" className="mt-2 px-0">
                    <Link to="/">← Voltar</Link>
                </Button>
            </header>

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
        </div>
    );
}
