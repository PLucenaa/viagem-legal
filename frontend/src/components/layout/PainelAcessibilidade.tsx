import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  Accessibility,
  Contrast,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import { useAcessibilidade } from "@/lib/useAcessibilidade";

const GAP_VLIBRAS_PX = 8;

function localizarBotaoVLibras(): HTMLElement | null {
  const candidatos = [
    document.querySelector<HTMLElement>("#vlibras-access-wrapper"),
    document.querySelector<HTMLElement>("[vw-access-button]"),
  ];
  for (const el of candidatos) {
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width >= 8 && rect.height >= 8) return el;
  }
  return null;
}

function posicionarAbaixoDoVLibras(raiz: HTMLElement): boolean {
  const alvo = localizarBotaoVLibras();
  if (!alvo) return false;
  const rect = alvo.getBoundingClientRect();
  raiz.style.top = `${Math.round(rect.bottom + GAP_VLIBRAS_PX)}px`;
  raiz.style.right = `${Math.round(window.innerWidth - rect.right)}px`;
  raiz.style.bottom = "auto";
  raiz.style.left = "auto";
  return true;
}

/**
 * Botão flutuante próprio (não é extensão). Acompanha o botão do VLibras
 * e fica imediatamente abaixo dele, na mesma coluna da direita.
 */
export function PainelAcessibilidade() {
  const [aberto, setAberto] = useState(false);
  const painelId = useId();
  const tituloId = useId();
  const raizRef = useRef<HTMLDivElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const {
    contraste,
    fonte,
    podeAumentar,
    podeDiminuir,
    toggleContraste,
    aumentarFonte,
    diminuirFonte,
    resetar,
  } = useAcessibilidade();

  useLayoutEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) return;

    const posicionar = () => posicionarAbaixoDoVLibras(raiz);
    posicionar();

    window.addEventListener("resize", posicionar);
    const observer = new MutationObserver(posicionar);
    observer.observe(document.body, { childList: true, subtree: true });
    const tentativas = [400, 1200, 3000, 6000].map((ms) =>
      window.setTimeout(posicionar, ms),
    );

    return () => {
      window.removeEventListener("resize", posicionar);
      observer.disconnect();
      tentativas.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (!aberto) return;

    const fecharComEscape = (evento: KeyboardEvent) => {
      if (evento.key !== "Escape") return;
      setAberto(false);
      botaoRef.current?.focus();
    };
    const fecharFora = (evento: MouseEvent) => {
      if (!raizRef.current?.contains(evento.target as Node)) {
        setAberto(false);
      }
    };

    document.addEventListener("keydown", fecharComEscape);
    document.addEventListener("mousedown", fecharFora);
    return () => {
      document.removeEventListener("keydown", fecharComEscape);
      document.removeEventListener("mousedown", fecharFora);
    };
  }, [aberto]);

  return (
    <div
      ref={raizRef}
      id="a11y-widget"
      className="fixed top-[calc(50%+1.75rem)] right-[max(0.75rem,env(safe-area-inset-right))] z-50 flex flex-col items-end gap-2 print:hidden"
    >
      <button
        ref={botaoRef}
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-controls={aberto ? painelId : undefined}
        aria-label="Acessibilidade"
        title="Acessibilidade"
        className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-full bg-ink text-paper shadow-md
        transition hover:bg-ink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavrado focus-visible:ring-offset-2"
      >
        <Accessibility className="size-6" aria-hidden />
      </button>
      {aberto && (
        <div
          id={painelId}
          role="dialog"
          aria-labelledby={tituloId}
          className="w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-border bg-card p-3 text-card-foreground shadow-lg"
        >
          <p
            id={tituloId}
            className="px-1 pb-2 text-xs font-semibold tracking-wide text-foreground uppercase"
          >
            Controles de acessibilidade
          </p>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={diminuirFonte}
                disabled={!podeDiminuir}
                aria-label="Diminuir texto"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-muted disabled:opacity-40"
              >
                <Minus className="size-4" aria-hidden />
                <span className="sr-only">A−</span>
              </button>
              <p className="min-w-0 flex-1 text-center text-sm tabular-nums" aria-live="polite">
                Texto {fonte}%
              </p>
              <button
                type="button"
                onClick={aumentarFonte}
                disabled={!podeAumentar}
                aria-label="Aumentar texto"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-muted disabled:opacity-40"
              >
                <Plus className="size-4" aria-hidden />
                <span className="sr-only">A+</span>
              </button>
            </div>

            <button
              type="button"
              onClick={toggleContraste}
              aria-pressed={contraste}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-background px-3 text-left text-sm text-foreground transition hover:bg-muted"
            >
              <Contrast className="size-4 shrink-0" aria-hidden />
              Alto contraste
            </button>

            <button
              type="button"
              onClick={resetar}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-left text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="size-4 shrink-0" aria-hidden />
              Redefinir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
