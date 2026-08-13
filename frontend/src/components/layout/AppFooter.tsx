import { FOOTER } from "@/lib/footer";

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/60 print:hidden">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-4 text-[11px] text-muted-foreground uppercase tracking-wide sm:flex-row sm:justify-between sm:gap-4 sm:px-6 sm:text-xs">
        <p className="order-2 text-center sm:order-1 sm:text-left">
          {FOOTER.copyright}
        </p>
        <p className="order-3 tabular-nums">{FOOTER.versao}</p>
      </div>
    </footer>
  );
}
