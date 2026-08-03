import { FOOTER } from "@/lib/footer";

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-black/10 bg-[#FCFBF4] print:hidden">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:gap-4 sm:px-6 sm:text-sm">
        <p className="order-2 text-center sm:order-1 sm:text-left">
          {FOOTER.copyright}
        </p>

        <div className="order-1 flex flex-wrap items-center justify-center gap-2 sm:order-2">

        </div>

        <p className="order-3 tabular-nums">{FOOTER.versao}</p>
      </div>
    </footer>
  );
}
